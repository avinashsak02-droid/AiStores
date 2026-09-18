import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBPbcWlALEKrw1VSNal-Rr1ERHQD4CpWCE",
  authDomain: "ai-store-45fb2.firebaseapp.com",
  projectId: "ai-store-45fb2",
  storageBucket: "ai-store-45fb2.firebasestorage.app",
  messagingSenderId: "593549024360",
  appId: "1:593549024360:web:4d4e02f5ad00081fd1efdd",
  measurementId: "G-RQ3FDD82VF"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()