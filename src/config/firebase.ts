import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// Get these from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
// Import the functions you need from the SDKs you need

const firebaseConfig = {
  apiKey: "AIzaSyCUt9PfbxJrRcU3ZF_uhnSoj_pAoMYxlh0",
  authDomain: "chat1to1-49973.firebaseapp.com",
  projectId: "chat1to1-49973",
  storageBucket: "chat1to1-49973.firebasestorage.app",
  messagingSenderId: "718770343677",
  appId: "1:718770343677:web:75ffce9a20699b95b6f894",
  measurementId: "G-B3PJ0S9EKM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
