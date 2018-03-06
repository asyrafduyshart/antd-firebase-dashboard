let firebaseApi;
// const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if (hostname === 'dashboard-demo.netlify.com') {
  firebaseApi = 'https://https://us-central1-zenbu-resto-user.cloudfunctions.net';
} else if (hostname === 'staging.realsite.com') {
  firebaseApi = 'https://staging.api.realsite.com';
} else if (/^qa/.test(hostname)) {
  firebaseApi = `https://api.${hostname}`;
} else {
  firebaseApi = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:5000/zenbu-resto-user/us-central1';
}

export const FIREBASE_HOST = `${firebaseApi}`;
export const FIREBASE_HOST_MOCK = `${firebaseApi}/mock`;
