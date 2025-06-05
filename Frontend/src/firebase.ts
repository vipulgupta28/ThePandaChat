// src/firebase.js
import {initializeApp} from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8ASzCirm3KzhG5HMpkoxFLYsO2vTjQfs",
  authDomain: "panda-8fedc.firebaseapp.com",
  // other config values
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
