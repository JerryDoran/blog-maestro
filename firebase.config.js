// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'note-maestro-4be3c.firebaseapp.com',
  projectId: 'note-maestro-4be3c',
  storageBucket: 'note-maestro-4be3c.firebasestorage.app',
  messagingSenderId: '698481709107',
  appId: '1:698481709107:web:01faf0c3636aaaba655346',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
