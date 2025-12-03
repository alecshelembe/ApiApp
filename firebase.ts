// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDqL1um9n6NQnEBCKioR7LSKCXcCiVoTTQ",

  authDomain: "sadies-bistro.firebaseapp.com",

  projectId: "sadies-bistro",

  storageBucket: "sadies-bistro.firebasestorage.app",

  messagingSenderId: "1020934262830",

  appId: "1:1020934262830:web:36fb9522b94a832fac8fbf",

  measurementId: "G-V63MS70ET9"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
