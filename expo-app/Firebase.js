import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';

// Config and initialisation for Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDCOCR5F87FjczvTf62skOGPymUcvLF2ls",
    authDomain: "cs5041-p3-22852.firebaseapp.com",
    databaseURL: "https://cs5041-p3-22852-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cs5041-p3-22852",
    storageBucket: "cs5041-p3-22852.appspot.com",
    messagingSenderId: "246697247841",
    appId: "1:246697247841:web:1aee6f26da52afc640d620"
};


const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const db = getDatabase(firebaseApp);