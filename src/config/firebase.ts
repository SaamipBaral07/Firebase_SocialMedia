// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";  
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiWZ_laESAzhm1aaHzd0YB4K_UFihNv1s",
  authDomain: "react-project-b2f5a.firebaseapp.com",
  projectId: "react-project-b2f5a",
  storageBucket: "react-project-b2f5a.firebasestorage.app",
  messagingSenderId: "965199441527",
  appId: "1:965199441527:web:e4531081327387cc336072",
  measurementId: "G-M61PF85DC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
export const db=getFirestore(app);