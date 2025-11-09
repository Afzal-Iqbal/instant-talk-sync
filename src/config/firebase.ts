// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
