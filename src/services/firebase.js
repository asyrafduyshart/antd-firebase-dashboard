import * as firebase from 'firebase';
import { firebaseApp, firestore } from '../utils/firebase';
import { getToken } from './api';


// login
export async function fetchLoginWithEmail({ email, password }) {
  const { emailVerified } = await firebaseApp.auth().signInWithEmailAndPassword(email, password);
  const idToken = await firebaseApp.auth().currentUser.getIdToken();
  const { token } = await getToken({ token: idToken });
  const webtoken = token;

  return {
    token: webtoken,
    emailVerified,
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

  await firestore.collection('users').add({
    uid,
    username,
    email,
  });

  await user.sendEmailVerification();
  return response;
}

export async function getCurrentFirebaseUser(callback) {
  firebaseApp.auth().onAuthStateChanged(callback);
}

export async function logoutFirebase() {
  return firebaseApp.auth().signOut();
}

// Firestore
export async function addOrderData(payload) {
  const user = firebase.auth().currentUser;
  const { uid } = user;

  const order = await firestore.collection('orders').add({
    ...payload,
    uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return order;
}

export async function getOrderById(id) {
  const orderRef = firestore.collection('orders').doc(id);
  const order = await orderRef.get();
  if (order.exists) {
    return order.data();
  } else {
    return null;
  }
}

export async function getMyOrders() {
  const ordersRef = firestore.collection('orders');
  const uid = await getUid();
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
  const uid = await getUid();

  const querySnapshot = await ordersRef.where('uid', '==', uid).startAfter(visible).limit(10).get();

  // Get the last visible document
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

  const orders = [];
  querySnapshot.forEach((element) => {
    orders.push({ id: element.id, key: element.id, ...element.data() });
  });
  return { orders, lastVisible };
}


// Private functions
const getUid = () => {
  return new Promise((resolve, reject) => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user.uid);
      }
      reject(new Error('NotFound'));
    });
  });
};
