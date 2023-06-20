import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATY18bSkf_so8MAeM4mFBje_UNGP9PyTU",
  authDomain: "virittamo-tyoaikakirjaus.firebaseapp.com",
  projectId: "virittamo-tyoaikakirjaus",
  storageBucket: "virittamo-tyoaikakirjaus.appspot.com",
  messagingSenderId: "595897029838",
  appId: "1:595897029838:web:e743787a84a57a9878ec9f",
  measurementId: "G-J80ZY379HE",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
