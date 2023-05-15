import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const createUser = async (email, password) => {
    try {
      const userdata = await createUserWithEmailAndPassword(auth, email, password);
      if (email.includes("@edu.hel.fi")) {
        await setDoc(doc(db, "employees", userdata.user.uid), {
          email: email,
        });
      }
      signOut(auth);
      await sendEmailVerification(userdata.user);
      await setDoc(
        doc(db, "logs", new Date().toJSON().slice(0, 10)),
        {
          [new Date().toLocaleTimeString("en-GB")]: userdata.user.uid + " created user",
        },
        { merge: true }
      );
      setMessage("Vahvistuspyyntö lähetetty antamaasi sähköpostiosoitteeseen.");
      setShowMessage(true);
    } catch (error) {
      setMessage("Käyttäjätilin luominen ei onnistunut: " + error);
      setShowMessage(true);
    }
  };

  const signIn = async (email, password) => {
    try {
      const userdata = await signInWithEmailAndPassword(auth, email, password);
      if (!userdata.user.emailVerified) {
        signOut(auth);
        setMessage("Ole hyvä ja käy vahvistamassa rekisteröityminen antamassasi sähköpostiosoitteessa");
        setShowMessage(true);
      }
      await setDoc(
        doc(db, "logs", new Date().toJSON().slice(0, 10)),
        {
          [new Date().toLocaleTimeString("en-GB")]: userdata.user.uid + " signed in",
        },
        { merge: true }
      );
    } catch (error) {
      setMessage("Kirjautuminen ei onnistunut antamallasi sähköpostilla ja salasanalla: " + error);
      setShowMessage(true);
    }
  };

  const logout = async () => {
    if (user) {
      await setDoc(
        doc(db, "logs", new Date().toJSON().slice(0, 10)),
        {
          [new Date().toLocaleTimeString("en-GB")]: user.uid + " signed out",
        },
        { merge: true }
      );
    }
    setAdmin(false);
    return signOut(auth);
  };

  const closeMessage = () => {
    setMessage("");
    setShowMessage(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email.includes("@hel.fi")) {
        setAdmin(true);
      }
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        createUser,
        user,
        admin,
        logout,
        signIn,
        showMessage,
        message,
        closeMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
