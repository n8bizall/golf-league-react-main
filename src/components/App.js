import React from "react";
import "../styles/bootstrap.scss";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Schedule from "./Schedule";
import Add from "./Add";
import Leaderboard from "./Leaderboard";

function App() {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center spl-body"
    >
      <div className="w-100">
        <Router>
          <AuthProvider>
            <DataProvider>
              <Routes>
                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/update-profile" element={<UpdateProfile />} />
                  <Route path="/add" element={<Add />} />
                </Route>

                {/* Public Routes */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </DataProvider>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
