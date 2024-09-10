// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdfqp1Ov90Hoibv17X-Ue79jdJk4FyhiI",
  authDomain: "golfleague2025.firebaseapp.com",
  databaseURL: "https://golfleague2025-default-rtdb.firebaseio.com",
  projectId: "golfleague2025",
  storageBucket: "golfleague2025.appspot.com",
  messagingSenderId: "575574407684",
  appId: "1:575574407684:web:cc14ae21ab82aac9b0d351",
  measurementId: "G-DJXHVZFSBG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore
export const analytics = getAnalytics(app); //Analytics

export const storage = getStorage(app); // Storage (if you're using it)

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.error(
      "Multiple tabs open, persistence can only be enabled in one tab at a time."
    );
  } else if (err.code === "unimplemented") {
    console.error("The current browser does not support offline persistence.");
  }
});

export default app;
