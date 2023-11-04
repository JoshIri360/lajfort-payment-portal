// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBep8mat3MQ-7-WpaZYTt_ZNj1qqAfGAcY",
  authDomain: "aws--files.firebaseapp.com",
  projectId: "aws--files",
  storageBucket: "aws--files.appspot.com",
  messagingSenderId: "499740251210",
  appId: "1:499740251210:web:3f08de54d8eed7cfa6c2b3",
  measurementId: "G-6F65FKRVPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);        
      }
      unsubscribe();
    }, reject);
  });
}