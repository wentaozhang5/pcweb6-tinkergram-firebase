// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfwq4aMSPAxhGDm88J5IDkd89hk0PV2iE",
  authDomain: "pcweb6-e0663.firebaseapp.com",
  projectId: "pcweb6-e0663",
  storageBucket: "pcweb6-e0663.appspot.com",
  messagingSenderId: "489900601755",
  appId: "1:489900601755:web:1bed6c621149d4536ff13e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);