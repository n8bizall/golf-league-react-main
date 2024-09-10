import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Firestore DB instance

export default function Signup() {
  const firstNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const teamRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      // Call the signup function to create the user
      const newUser = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );

      // Add player details to Firestore
      await addPlayerToFirestore(
        newUser.user.uid,
        firstNameRef.current.value,
        teamRef.current.value
      );

      // Navigate to the homepage after signup
      navigate("/");
    } catch (error) {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  // Function to add player data to Firestore
  async function addPlayerToFirestore(uid, firstName, team) {
    try {
      const playerRef = doc(db, "players", uid); // Use UID as the document ID
      await setDoc(playerRef, {
        uid: uid,
        firstName: firstName,
        team: team,
        handicap: null, // Placeholder for handicap, update as needed
        scores: [], // Initialize with an empty array for scores
      });
      console.log("Player data added to Firestore successfully.");
    } catch (error) {
      console.error("Error adding player data to Firestore:", error);
      setError("Failed to save player data");
    }
  }

  return (
    <div className="auth-container">
      <div>
        <Card
          className="auth-card auth-card-container"
          style={{ width: "20rem" }}
        >
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" id="fname">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" ref={firstNameRef} required />
              </Form.Group>
              <Form.Group className="mb-4" id="team">
                <Form.Label>Team</Form.Label>
                <Form.Select ref={teamRef} required>
                  <option value="" disabled selected hidden>
                    Select Your Team
                  </option>
                  <option value="team1">Ashly / Jimmy</option>
                  <option value="team2">Chuck / Bernie</option>
                  <option value="team3">Del / Tom</option>
                  <option value="team4">Dennis / Kyle</option>
                  <option value="team5">Brian / Tim</option>
                  <option value="team6">Ghost Team</option>
                  <option value="team7">Nate / Jeff</option>
                  <option value="team8">Jacob / Matt</option>
                  <option value="team9">Jim / Tom</option>
                  <option value="team10">Alex / Alonzo</option>
                  <option value="team11">Andrew / Danny</option>
                  <option value="team12">Ken / Jason</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4" id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group className="mb-4" id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
                <Form.Text className="text-muted">
                  Must contain more than 6 characters
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
