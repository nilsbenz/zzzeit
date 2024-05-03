import { getApp, getApps, initializeApp } from "firebase/app";
import { GithubAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const githubProvider = new GithubAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyD7tqsoXMjqyHEg5NvaRbZwY9W0FYpalxI",
  authDomain: "zzzeit.firebaseapp.com",
  projectId: "zzzeit",
  storageBucket: "zzzeit.appspot.com",
  messagingSenderId: "263162817338",
  appId: "1:263162817338:web:646bbb554f15a2c609fe03",
};

const firebase = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(firebase);
const db = getFirestore(firebase);

export { auth, db, githubProvider };
export default firebase;
