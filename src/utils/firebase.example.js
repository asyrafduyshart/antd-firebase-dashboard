import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: '[API_KEY]',
  authDomain: '[YOUR-APP].firebaseapp.com',
  databaseURL: 'https://[YOUR-APP].firebaseio.com',
  projectId: '[YOUR-APP]',
  storageBucket: '[YOUR-APP].appspot.com',
  messagingSenderId: '[YOUR-MESSENGER-ID]',
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;
