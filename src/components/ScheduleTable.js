import React from "react";
import { schedule } from "../json/schedule";
import { useData } from "../contexts/DataContext";
import { Container, Table } from "react-bootstrap";
import "../styles/schedule.css";

export default function ScheduleTable() {
  const { teamsData } = useData();
  let roundNum = 0;

  const teamName = (team) => {
    let teamMembers = "No Members Yet";
    Object.keys(teamsData).map((teamId, index) => {
      if (team === teamId) {
        teamMembers = teamsData[teamId].members;
      }
    });
    return teamMembers;
  };
  const score = (team, index) => {
    let score = 0;
    Object.keys(teamsData).map((teamId) => {
      if (team === teamId) {
        score = teamsData[teamId].rounds[index].points;
      }
    });
    return score;
  };

  if (!teamsData) {
    return <h3>Loading Team Data</h3>;
  }

  return (
    <div>
      {Object.keys(schedule).map((block, courseIndex) => {
        return (
          <Container key={courseIndex}>
            <h3 key={courseIndex}> {schedule[block].course}</h3>
            {Object.keys(schedule[block].matchups).map((rounds, index) => {
              {
                roundNum += 1;
              }
              return (
                <div key={index} className="round-wrapper">
                  <div className="schedule-header">
                    <h4 className="round-header">Round {roundNum}</h4>
                    <div className="line"></div>
                    <h5 className="round-dates">TBD</h5>
                  </div>

                  <Table hover>
                    <thead>
                      <tr>
                        <th>Home</th>
                        <th>Points</th>
                        <th>Away</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule[block].matchups[rounds].map(
                        (round, roundIndex) => {
                          return (
                            <tr key={round + roundIndex}>
                              <td>{teamName(round.teamOneId)}</td>
                              <td data-round={roundIndex}>
                                {score(round.teamOneId, roundNum - 1)}
                              </td>
                              <td>{teamName(round.teamTwoId)}</td>
                              <td>{score(round.teamTwoId, roundNum - 1)}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                </div>
              );
            })}
          </Container>
        );
      })}
    </div>
  );
}
