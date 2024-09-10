import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export default function Add() {
  const { currentUser } = useAuth();

  function createUser() {
    return db.collection(currentUser.displayName).add({
      email: currentUser.email,
    });
  }

  return (
    <div>
      <button onClick={createUser}>Add User To Database</button>
    </div>
  );
}
