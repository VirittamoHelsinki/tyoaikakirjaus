import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcvacIAZlsFg0j_S38tD_8WcP6GJh1IV8",
  authDomain: "tyoaikakirjaus-a0a15.firebaseapp.com",
  projectId: "tyoaikakirjaus-a0a15",
  storageBucket: "tyoaikakirjaus-a0a15.appspot.com",
  messagingSenderId: "798135307060",
  appId: "1:798135307060:web:482c4472f6d5ce96503361",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeTPLwmAAAAACrpCCniRfHkbdONeIj_qKjBCnvd"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});
