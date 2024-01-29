import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBwpktWi16OAJNcTcXKonCWmOOY51FpE6o",
  authDomain: "leafpad-851eb.firebaseapp.com",
  projectId: "leafpad-851eb",
  storageBucket: "leafpad-851eb.appspot.com",
  messagingSenderId: "607419277898",
  appId: "1:607419277898:web:fe533c0d26803abe60bcb3"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DATABASE = getDatabase(FIREBASE_APP);
