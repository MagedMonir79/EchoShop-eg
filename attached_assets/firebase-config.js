// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYRpJvuoCgfpD39Vi8ZCLGjRj3XEuT4c",
  authDomain: "echoshop-de4a2.firebaseapp.com",
  projectId: "echoshop-de4a2",
  storageBucket: "echoshop-de4a2.appspot.com",
  messagingSenderId: "520831479136",
  appId: "1:520831479136:web:c13b15240347b834e46a05",
  measurementId: "G-33719HZKKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
