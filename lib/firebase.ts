import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHAUWBqAva-H4oDHZirZvJq6_FcKzVdaw",
  authDomain: "perceptive-rigging-jzp2g.firebaseapp.com",
  projectId: "perceptive-rigging-jzp2g",
  storageBucket: "perceptive-rigging-jzp2g.firebasestorage.app",
  messagingSenderId: "118211683788",
  appId: "1:118211683788:web:b3387c45a011b0be2c6969"
};

// Initialize Firebase safely (prevent duplicate initialization in SSR/Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
