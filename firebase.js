// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCTUgSAhYMLlb_Z1W1YvYpk8E0BXZphvzE",
    authDomain: "bootcamp-f023a.firebaseapp.com",
    projectId: "bootcamp-f023a",
    storageBucket: "bootcamp-f023a.appspot.com",
    messagingSenderId: "813458147013",
    appId: "1:813458147013:web:6292bf1c9d3b44f1f752ac",
    measurementId: "G-4RXZEW67YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);// Initialize Cloud Firestore and get a reference to the service
const  db = firebase.firestore();