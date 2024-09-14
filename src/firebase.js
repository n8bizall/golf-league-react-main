// Import the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Initialize Firebase services as variables (not exported yet)
let auth, db, analytics, storage;

// Function to fetch Firebase configuration from Cloud Function
const fetchFirebaseConfig = async () => {
  try {
    const response = await fetch("<YOUR_CLOUD_FUNCTION_URL>"); // Replace with your Cloud Function URL
    if (!response.ok) {
      throw new Error("Failed to fetch Firebase config");
    }
    const firebaseConfig = await response.json();
    return firebaseConfig;
  } catch (error) {
    console.error("Error fetching Firebase config:", error);
    return null;
  }
};

// Initialize Firebase only after fetching config
const initializeFirebase = async () => {
  const firebaseConfig = await fetchFirebaseConfig();
  if (firebaseConfig) {
    // Initialize Firebase with the fetched configuration
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    auth = getAuth(app); // Authentication
    db = getFirestore(app); // Firestore
    analytics = getAnalytics(app); // Analytics
    storage = getStorage(app); // Storage

    // Enable IndexedDB persistence for Firestore
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === "failed-precondition") {
        console.error(
          "Multiple tabs open, persistence can only be enabled in one tab at a time."
        );
      } else if (err.code === "unimplemented") {
        console.error(
          "The current browser does not support offline persistence."
        );
      }
    });

    console.log("Firebase initialized successfully");
  } else {
    console.error("Failed to initialize Firebase");
  }
};

// Call the function to initialize Firebase
initializeFirebase();

// Export Firebase services (exports are outside the function)
export { auth, db, analytics, storage };
