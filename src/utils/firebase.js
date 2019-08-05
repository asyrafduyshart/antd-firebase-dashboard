import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import config from '../../config/firebase.config';

export { firebase };
export const firebaseApp = firebase.initializeApp(config);
export default firebaseApp;
