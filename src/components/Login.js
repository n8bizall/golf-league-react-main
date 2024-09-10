import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import "../styles/auth.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission for login
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log("User logged in:", userCredential.user);

      // Redirect the user to the homepage after login
      navigate("/");
    } catch (error) {
      // Handle Firebase-specific errors
      handleFirebaseErrors(error);
    }

    setLoading(false);
  }

  // Handle Firebase-specific login errors
  function handleFirebaseErrors(error) {
    switch (error.code) {
      case "auth/invalid-email":
        setError("Invalid email format.");
        break;
      case "auth/user-not-found":
        setError("No account found with this email.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password.");
        break;
      default:
        setError(error.message || "Failed to sign in. Please try again.");
    }
  }

  return (
    <div className="auth-container">
      <Card
        className="auth-card auth-card-container"
        style={{ width: "20rem" }}
      >
        <Card.Body>
          <div className="login-header text-center">
            <img
              src="/wgc(192).png"
              width="150"
              height="150"
              className="d-inline-block align-top"
              alt="Thursday Night Open League - 2025"
            />
            <h2 className="mb-4 mt-0">Login</h2>
          </div>

          {/* Display error message */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Login Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                disabled={loading} // Disable input while loading
              />
            </Form.Group>

            <Form.Group className="mb-4" id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
                disabled={loading} // Disable input while loading
              />
            </Form.Group>

            <Button disabled={loading} className="w-100" type="submit">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        Need an Account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
