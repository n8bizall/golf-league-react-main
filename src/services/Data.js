import React from "react";
import firebase from "firebase/compat/app";
import { db, auth } from "../firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { schedule } from "../json/schedule";

export function createUser(id, email, firstName, team) {
  setDoc(doc(db, "users", id), {
    firstName: firstName,
    email: email,
    teamId: team,
  });
  return true;
}

export function partnerCheck(firstName, team, id) {
  let newTeam = true;
  db.collection("teams").onSnapshot((snapshot) => {
    const documents = snapshot.docs;
    documents.forEach((doc) => {
      if (doc.id === team) {
        newTeam = false;
        db.collection("teams")
          .doc(team)
          .update({
            membersArr: firebase.firestore.FieldValue.arrayUnion(firstName),
            permissionsArr: firebase.firestore.FieldValue.arrayUnion(id),
          });
      }
    });
    if (newTeam) {
      let rounds = [];
      for (let i = 0; i <= 16; i++) {
        rounds.push({ opponent: "Team", points: 0 });
      }

      // Add a new document in collection "cities"
      db.collection("teams")
        .doc(team)
        .set({
          membersArr: [firstName],
          permissionsArr: [id],
          totalPoints: parseInt(0),
          rounds: rounds,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
  });

  return true;
}
