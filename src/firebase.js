// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAfijQTf_9GIFBpsh9I61RlSm-ffXzsqo",
  authDomain: "money-management-app-68a6f.firebaseapp.com",
  projectId: "money-management-app-68a6f",
  storageBucket: "money-management-app-68a6f.firebasestorage.app",
  messagingSenderId: "961628966048",
  appId: "1:961628966048:web:9da753f12a11542b4d8dc5",
  measurementId: "G-56W0B1F784"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const loansCollection = collection(db, 'loans');
export { db };