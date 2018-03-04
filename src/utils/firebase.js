import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyBUTy_m8OluJROkkhDgdfX91JaR0PMDWhk',
  authDomain: 'zenbu-resto-user.firebaseapp.com',
  databaseURL: 'https://zenbu-resto-user.firebaseio.com',
  projectId: 'zenbu-resto-user',
  storageBucket: 'zenbu-resto-user.appspot.com',
  messagingSenderId: '734777832860',
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;
