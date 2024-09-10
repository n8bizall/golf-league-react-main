import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const { userData, teamsData } = useData();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const teamNameRef = useRef();
  const teamImgRef = useRef();
  const { currentUser, updatePassword, updateEmail, teamName, teamImg } =
    useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const history = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (teamNameRef.current.value) {
      promises.push(teamName(userData, teamNameRef.current.value));
    }
    if (img) {
      promises.push(teamImg(userData, img));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  if (!userData || !teamsData) {
    return (
      <div className="auth-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                  defaultValue={currentUser.email}
                />
              </Form.Group>

              <Form.Group id="teamName" className="mb-4">
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={teamsData[userData.teamId].teamName}
                  ref={teamNameRef}
                />
              </Form.Group>

              <Form.Group
                controlId="formFile"
                id="teamImg"
                onChange={(e) => {
                  setImg(e.target.files[0]);
                }}
                className="mb-4"
              >
                <Form.Label>Team Image</Form.Label>
                <Form.Control type="file" ref={teamImgRef} />
              </Form.Group>

              <Form.Group id="password" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>

              <Form.Group id="password-confirm" className="mb-4">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Link to="/">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
