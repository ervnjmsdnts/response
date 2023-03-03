// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCJKdKxfhLjiy0Q1FbhY4F5ydy5nxKGdY0",
  authDomain: "quick-response-31c9c.firebaseapp.com",
  projectId: "quick-response-31c9c",
  storageBucket: "quick-response-31c9c.appspot.com",
  messagingSenderId: "51385186855",
  appId: "1:51385186855:web:3966b5fc64fa6c31136c02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
