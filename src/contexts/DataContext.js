import React, { useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const { currentUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState();
  const [teamsData, setTeamsData] = useState();
  const [loadingData, setLoadingData] = useState(true);

  // --------------------- CRUD Operations for Users ------------------------

  // Read user data
  async function readUser() {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "players", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error reading user data:", error);
    }
  }

  // Create or Update user data (since Firestore automatically updates if the document exists)
  async function createOrUpdateUser(userData) {
    try {
      const userRef = doc(db, "players", currentUser.uid);
      await setDoc(userRef, userData, { merge: true }); // Merge to avoid overwriting the whole document
      console.log("User data written successfully!");
    } catch (error) {
      console.error("Error writing user data:", error);
    }
  }

  // Delete user
  async function deleteUser() {
    try {
      const userRef = doc(db, "players", currentUser.uid);
      await deleteDoc(userRef);
      console.log("User deleted successfully!");
      setUserData(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // --------------------- CRUD Operations for Teams ------------------------

  // Read all teams data (ordered by total points)
  async function readTeams() {
    try {
      let teamsObj = {};
      const teamsCol = query(
        collection(db, "teams"),
        orderBy("totalPoints", "desc")
      );
      const teamsArr = await getDocs(teamsCol);
      teamsArr.forEach((team) => {
        teamsObj[team.id] = team.data();
      });
      setTeamsData(teamsObj);
    } catch (error) {
      console.error("Error reading teams data:", error);
    }
    setLoadingData(false);
  }

  // Create a new team
  async function createTeam(teamData) {
    try {
      const newTeamRef = await addDoc(collection(db, "teams"), teamData);
      console.log("New team created with ID:", newTeamRef.id);
      // Optionally, fetch teams again to reflect the new data
      readTeams();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  }

  // Update an existing team
  async function updateTeam(teamId, updatedTeamData) {
    try {
      const teamRef = doc(db, "teams", teamId);
      await updateDoc(teamRef, updatedTeamData);
      console.log("Team updated successfully!");
      // Optionally, fetch teams again to reflect the updated data
      readTeams();
    } catch (error) {
      console.error("Error updating team:", error);
    }
  }

  // Delete a team
  async function deleteTeam(teamId) {
    try {
      const teamRef = doc(db, "teams", teamId);
      await deleteDoc(teamRef);
      console.log("Team deleted successfully!");
      // Optionally, fetch teams again to reflect the deleted team
      readTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  }

  // --------------------- Use Effect for Initial Data Load ------------------------
  useEffect(() => {
    if (!authLoading && currentUser) {
      readUser(); // Read user data after login
      readTeams(); // Load teams data
    }
  }, [authLoading, currentUser]);

  // --------------------- Provide Data and Functions to Context ------------------------

  const value = {
    userData,
    setUserData,
    teamsData,
    setTeamsData,
    loadingData,
    createOrUpdateUser,
    deleteUser,
    createTeam,
    updateTeam,
    deleteTeam,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
