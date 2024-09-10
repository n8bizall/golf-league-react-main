import React from "react";
import { Col, Row } from "react-bootstrap";
import { useData } from "../contexts/DataContext";
import "../styles/teamHeader.css";

export default function TeamHeader(props) {
  const { teamsData } = useData();
  const teamName = props.teamId;

  return (
    <>
      <Row className="spl_team-header">
        <Col className="spl_header-left">
          {teamsData[teamName].imageUrl ? (
            <img
              alt="team icon"
              className="spl_team-image"
              src={teamsData[teamName].imageUrl}
            />
          ) : (
            ""
          )}
          <div className="spl_team-details">
            <p className="spl_team-name">
              {teamsData[teamName].teamName
                ? teamsData[teamName].teamName
                : "No Team Name"}
            </p>
            <h1 className="spl_team-members">{teamsData[teamName].members}</h1>
          </div>
        </Col>
      </Row>
    </>
  );
}
