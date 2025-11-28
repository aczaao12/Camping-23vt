// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCBmXHDfx-2_-Jc3hXpGppjS0ciplvwyZ0",
    authDomain: "dh23vt-d086a.firebaseapp.com",
    databaseURL: "https://dh23vt-d086a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dh23vt-d086a",
    storageBucket: "dh23vt-d086a.firebasestorage.app",
    messagingSenderId: "963314060185",
    appId: "1:963314060185:web:9709ad8237d2b2557b6108",
    measurementId: "G-FRBQS1N0C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);