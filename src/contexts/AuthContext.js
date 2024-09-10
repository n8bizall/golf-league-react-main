import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
//import { storage } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUser, partnerCheck } from "../services/Data";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  console.log(loading);
  async function signup(email, password, firstName, team) {
    try {
      // Create the user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password);

      console.log(res);
      // After successfully signing up, proceed to create the user and check partner
      await createUser(res.user.uid, email, firstName, team);
      await partnerCheck(firstName, team, res.user.uid);
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  }
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }
  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }
  // function teamImg(user, teamImg) {
  //   // Create a root reference
  //   const imgRef = storage.ref(`teamImages/${teamImg.name}`).put(teamImg);
  //   imgRef.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       setProgress(progress);
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       storage
  //         .ref(`teamImages/${teamImg.name}`)
  //         .getDownloadURL()
  //         .then((url) => {
  //           setUrl(url);
  //           const teamRef = db.collection("teams").doc(user.teamId);
  //           return teamRef
  //             .update({
  //               imageUrl: url,
  //             })
  //             .then(() => {
  //               console.log("Document successfully updated!");
  //             })
  //             .catch((error) => {
  //               // The document probably doesn't exist.
  //               console.error("Error updating document: ", error);
  //             });
  //         });
  //     }
  //   );
  // }
  function teamName(user, teamName) {
    const teamRef = db.collection("teams").doc(user.teamId);
    return teamRef
      .update({
        teamName: teamName,
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(true);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    teamName,
    //  teamImg,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
