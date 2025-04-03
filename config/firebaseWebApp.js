const { initializeApp } = require('firebase/app');

// Firebase web app configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA1a_M68xvwRgZGXhxtpVlWjylJmAkNz-w',
  authDomain: 'aarvasa-property-listing.firebaseapp.com',
  projectId: 'aarvasa-property-listing',
  storageBucket: 'aarvasa-property-listing.firebasestorage.app',
  messagingSenderId: '585447833026',
  appId: '1:585447833026:web:dee77232e32fc7acf7aa5b',
  measurementId: 'G-WLPDKTJCBJ',
};

// Initialize Firebase web app
const firebaseWebApp = initializeApp(firebaseConfig);

console.log('Firebase web app initialized successfully.');

module.exports = firebaseWebApp;