import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvGkQC_T7hyVFh0H8QLCVT6CzYPLhXzuY",
  authDomain: "lokit-79fdd.firebaseapp.com",
  projectId: "lokit-79fdd",
  storageBucket: "lokit-79fdd.firebasestorage.app",
  messagingSenderId: "374346791115",
  appId: "1:374346791115:web:6ad4976f84b7696d71434e"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);