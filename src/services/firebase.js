import * as firebase from 'firebase';
import { eventChannel } from 'redux-saga';
import { firebaseApp, firestore } from '../utils/firebase';
import { getToken } from './api';

import statusEnum from '../utils/orderStatusEnum';


// login
export async function fetchLoginWithEmail({ email, password }) {
  const { emailVerified } = await firebaseApp.auth().signInWithEmailAndPassword(email, password);
  const idToken = await firebaseApp.auth().currentUser.getIdToken();
  const { token } = await getToken({ token: idToken });
  const webtoken = token;

  const { authority } = await getUserData();
  return {
    token: webtoken,
    emailVerified,
    authority,
  };
}

export async function fetchSendVerification({ mobile, appVerifier }) {
  return firebaseApp.auth().signInWithPhoneNumber(mobile, appVerifier);
}

export async function fetchWithCredential({ verificationId, code, username }) {
  const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

  await firebaseApp.auth().signInWithCredential(credential);
  const idToken = await firebaseApp.auth().currentUser.getIdToken();
  const user = firebase.auth().currentUser;
  await user.updateProfile({
    displayName: username,
  });
  const { token } = await getToken({ token: idToken });
  const webtoken = token;

  return {
    status: 'ok',
    token: webtoken,
  };
}

// Register
export async function fetchRegisterWithEmail({ email, password, username }) {
  const response = await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
  const user = firebase.auth().currentUser;
  const { uid } = user;
  await user.updateProfile({
    displayName: username,
  });

  await firestore.collection('users').doc(uid).set({
    uid,
    username,
    email,
    role: 'user',
  });

  await user.sendEmailVerification();
  return response;
}

export async function getCurrentFirebaseUser() {
  const { displayName, uid } = await getCurrentUser();
  const { authority } = await getUserData();
  return { displayName, uid, authority };
}

export async function logoutFirebase() {
  return firebaseApp.auth().signOut();
}

// Firestore
export async function addOrderData(payload) {
  const user = await getCurrentUser();
  const { uid, displayName } = user;

  const order = await firestore.collection('orders').add({
    name: displayName,
    ...payload,
    uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    documentStatus: 1,
    financeStatus: 1,
    orderStatus: 0,
    status: statusEnum.SUBMISSION_CREATED,
  });

  return order;
}

export function updateOrderData(id, payload) {
  const ordersRef = firestore.collection('orders').doc(id);
  return ordersRef.update({
    updated: firebase.firestore.FieldValue.serverTimestamp(),
    ...payload,
  });
}

export async function addHistoryOrderData(id, payload) {
  const user = await getCurrentUser();
  const { uid, displayName } = user;

  const { status } = payload;
  const ordersRef = firestore.collection('orders').doc(id).collection('history');
  const history = ordersRef.add({
    status,
    displayName,
    uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return history;
}

export function getOrderById(id) {
  const ref = firestore.collection('orders').doc(id);

  const channel = eventChannel((emit) => {
    const unsubscribe = ref.onSnapshot((doc) => {
      emit(doc.data());
    });
    // unsubscribe function
    return () => unsubscribe();
  });

  return channel;
}

export async function getOrderHistory(id) {
  const ref = firestore.collection('orders').doc(id).collection('history').orderBy('timestamp');
  return eventChannel((emitter) => {
    const unsubscribe = ref.onSnapshot((querySnapshot) => {
      let histories = [];
      querySnapshot.forEach((doc) => {
        histories.push({ id: doc.id, ...doc.data() });
      });
      emitter(histories);
      histories = [];
    });
    // The subscriber must return an unsubscribe function
    return () => unsubscribe();
  }
  );
}

export async function getMyOrders() {
  const ordersRef = firestore.collection('orders');
  const { uid } = await getCurrentUser();
  const querySnapshot = await ordersRef.where('uid', '==', uid).limit(10).get();

  // Get the last visible document
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  const orders = [];
  querySnapshot.forEach((element) => {
    orders.push({ id: element.id, key: element.id, ...element.data() });
  });
  return { orders, lastVisible };
}

export async function getNextOrders(visible) {
  const ordersRef = firestore.collection('orders');
  const { uid } = await getCurrentUser();

  const querySnapshot = await ordersRef.where('uid', '==', uid).startAfter(visible).limit(10).get();

  // Get the last visible document
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  const orders = [];
  querySnapshot.forEach((element) => {
    orders.push({ id: element.id, key: element.id, ...element.data() });
  });
  return { orders, lastVisible };
}

export async function getUserData() {
  const { uid } = await getCurrentUser();
  const currentUserData = await firestore.collection('users').doc(uid).get();
  return currentUserData.data();
}

// Private functions
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      }
      reject(new Error('NotFound'));
    });
  });
};
