import * as firebase from 'firebase';
import firebaseApp from '../utils/firebase';
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
  await user.updateProfile({
    displayName: username,
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

