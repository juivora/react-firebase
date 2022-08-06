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
  updateDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

const databse = getDatabase(app)
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
        status: 1
      });
    }
  } catch (err) {
    console.error(err)
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password, setShowAlert, setAlertMessage) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    const userRef = collection(db, "users")
    const q = query(userRef, where("uid", "==", res.user.uid))
    let id;
    onSnapshot(q, (snapshot) => {
      snapshot.docs.map(doc => id = doc.id)
      const newRef = doc(db, "users", id);
      updateDoc(newRef, {
        status: 1
      })
    })
  }
  catch (error) {
    const errorMessage = error.message;
    setShowAlert(true)
    setAlertMessage(errorMessage)
    alert(errorMessage)
    return false

  };
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
      status: 1
    });
    return true
  } catch (err) {
    console.error(err);
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
  const userRef = collection(db, "users")
  const q = query(userRef, where("uid", "==", auth.currentUser.uid))
  let id;
  onSnapshot(q, (snapshot) => {
    snapshot.docs.map(doc => id = doc.id)
    const newRef = doc(db, "users", id);
    updateDoc(newRef, {
      status: 0
    })
  })
  signOut(auth);
};

// export default firebase.database()
export {
  auth,
  db,
  databse,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  storage
};