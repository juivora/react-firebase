import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database'
import {
  GoogleAuthProvider, getAuth,
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtQ9xy2LS9AXS7Pjr3SF-sGbTa77ZOUYs",
  authDomain: "react-firebase-feba8.firebaseapp.com",
  projectId: "react-firebase-feba8",
  messagingSenderId: "989921964069",
  appId: "1:989921964069:web:c24e4aa4b52a8493294fcc",
  measurementId: "G-GE1PZB53JT",
  databaseURL: "https://react-firebase-feba8-default-rtdb.firebaseio.com/",
  storageBucket: "react-firebase-feba8.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

// const db = getDatabase(app)
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async (setIsAuth) => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err)
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    return false
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    return true
  } catch (err) {
    console.error(err);
    // alert(err.message);
    return err.message
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

// export default firebase.database()
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  storage
};
