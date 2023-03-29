import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

// Config and initialisation for Firebase

const firebaseConfig = {
    apiKey: "AIzaSyAE1Mv2RPmpV1gma2kSRnojc-WVJtARkO0",
    authDomain: "cs5041-p3-dcdf7.firebaseapp.com",
    databaseURL: "https://cs5041-p3-dcdf7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cs5041-p3-dcdf7",
    storageBucket: "cs5041-p3-dcdf7.appspot.com",
    messagingSenderId: "342039128860",
    appId: "1:342039128860:web:81a1c1887ca9499e5568d9",
};


const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const db = getDatabase(firebaseApp);