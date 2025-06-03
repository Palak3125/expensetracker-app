import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth, GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth";
const firebaseConfig = {
  
  apiKey: "AIzaSyB6K0QRMD8tsfCE0zhja9FBtlU6YfyOqtY",
  authDomain: "money-app-d553a.firebaseapp.com",
  projectId: "money-app-d553a",
  storageBucket: "money-app-d553a.firebasestorage.app",
  messagingSenderId: "402603121914",
  appId: "1:402603121914:web:3be5e96e576b1816d17d43",
  measurementId: "G-8PJNYR1NKG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const loansCollection = collection(db, 'loans');
export { db };
export { auth, provider };