import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import Schedule from "./Schedule";
import Overview from "./Overview";
import Navigation from "./Navigation";
import Leaderboard from "./Leaderboard";

export const teamData = React.createContext();

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [user, setUser] = useState({});
  const [team, setTeam] = useState({ teamId: "", membersArr: [], rounds: [] });
  const [teamsObj, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const history = useNavigate();
  const userRef = doc(db, "players", currentUser.uid);

  // Handle Logout
  async function handleLogout() {
    setError("");
    try {
      await logout();
      history("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const getUsersAndTeamData = async () => {
    try {
      // Fetch user data
      const userData = await getUserData(currentUser.uid);
      setUser(userData);

      // Fetch team data if the user has a teamId
      if (userData.teamId) {
        const teamData = await getTeamData(userData.teamId);
        setTeam(teamData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "players", currentUser.uid); // Initialize userRef here
    console.log(JSON.stringify(userRef));
    await getUsersAndTeamData();
  }, [currentUser]);

  const getTeamData = async (teamId) => {
    const teamRef = doc(db, "teams", teamId); // Initialize teamRef for the team
    try {
      const teamDoc = await getDoc(teamRef);
      if (teamDoc.exists()) {
        const teamData = {
          teamId: teamId,
          membersArr: teamDoc.data().membersArr,
          rounds: teamDoc.data().rounds,
        };
        return teamData; // Return team data
      } else {
        throw new Error("No team data found");
      }
    } catch (err) {
      throw new Error("Failed to load team data");
    }
  };
  const getUserData = async (userId) => {
    const userRef = doc(db, "players", userId); // Initialize userRef for the user
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData; // Return user data
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      throw new Error("Failed to load user data");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navigation user={currentUser} />

      <Row>
        <Col>
          {teamsObj && Object.keys(teamsObj).length > 0 && (
            <Leaderboard data={teamsObj} />
          )}
          <Overview data={team} />
        </Col>
        <Col>
          <Card>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
              <Link to="/add" className="btn btn-primary w-100 mt-3">
                Database
              </Link>
            </Card.Body>
          </Card>
          {teamsObj && Object.keys(teamsObj).length > 0 && (
            <Schedule teamsObj={teamsObj} />
          )}
        </Col>
      </Row>

      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
