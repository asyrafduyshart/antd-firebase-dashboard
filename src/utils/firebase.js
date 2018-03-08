import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyDQ0MZKpaMgUToHUoZn8pCXlrqLFMU0OF0',
  authDomain: 'kreasi-nyata.firebaseapp.com',
  databaseURL: 'https://kreasi-nyata.firebaseio.com',
  projectId: 'kreasi-nyata',
  storageBucket: '',
  messagingSenderId: '737559140423',
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;
