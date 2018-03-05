import * as firebase from 'firebase';
import firebaseApp from '../utils/firebase';
import { getToken } from './api';


export async function fetchLoginWithEmail({ email, password }) {
  return firebaseApp.auth().signInWithEmailAndPassword(email, password);
}

export async function fetchSendVerification({ mobile, appVerifier }) {
  return firebaseApp.auth().signInWithPhoneNumber(mobile, appVerifier);
}

export async function fetchWithCredential({ verificationId, code }) {
  const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

  let idToken;
  let webtoken;

  try {
    await firebaseApp.auth().signInWithCredential(credential);
  } catch (error) {
    console.log('FIREBASE AUTH');
    console.error(error);
    return {
      status: 'error',
      message: error.message,
    };
  }

  try {
    idToken = await firebaseApp.auth().currentUser.getIdToken();
  } catch (error) {
    console.log('FIREBASE GET IDTOKEN');
    console.error(error);
    return {
      status: 'error',
      message: error.message,
    };
  }

  try {
    const { token } = await getToken({ token: idToken });
    webtoken = token;
  } catch (error) {
    console.log('GET TOKEN FROM WEB');
    console.error(error);
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'ok',
    token: webtoken,
  };
}
