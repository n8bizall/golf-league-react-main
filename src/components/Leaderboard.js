import React, { useState } from "react";
import SelectedTeam from "./SelectedTeam";
import Navigation from "./Navigation";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useData } from "../contexts/DataContext";
import "../styles/leaderboard.css";

export default function Leaderboard() {
  const { teamsData } = useData();
  const [selectedTeam, setselectedTeam] = useState();
  const [isSelected, setisSelected] = useState(false);
  if (!teamsData) {
    return <h3>Loading Leaderboard</h3>;
  }
  function teamScore(team) {
    return teamsData[team].totalPoints;
  }

  const showTeam = (team) => {
    setselectedTeam(team);
    setisSelected(true);
    document.getElementById("spl_leaderboard-table").style.display = "none";
  };
  const closeTeam = () => {
    setisSelected(false);
    document.getElementById("spl_leaderboard-table").style.display = "block";
  };

  return (
    <div className="m-2">
      <Navigation />
      <Container>
        <Row>
          <Col>
            {isSelected ? (
              <Button
                variant="primary"
                id="spl_back-btn"
                type="button"
                onClick={() => closeTeam()}
              >
                Back to Leaderboard
              </Button>
            ) : (
              ""
            )}
            {isSelected ? <SelectedTeam selected={selectedTeam} /> : ""}
            <div id="spl_leaderboard-table">
              <div className="leaderboard-header">
                <div className="position-header">Position</div>
                <div className="team-members-header">Team</div>
                <div className="total-points-header">Points</div>
                <div></div>
              </div>
              {Object.keys(teamsData).map((team, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => showTeam(team)}
                    className="leaderboard-row"
                  >
                    <div className="position">0{index + 1}</div>
                    <div className="team-members">
                      {teamsData[team].members}
                    </div>
                    <div className="total-points">{teamScore(team)}</div>
                    <div></div>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
