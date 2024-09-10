import React from "react";
import { useData } from "../contexts/DataContext";
import "../styles/overview.css";
import StatCards from "./StatCards";
import TeamHeader from "./TeamHeader";

export default function SelectedTeam(props) {
  const { teamsData } = useData();

  const completedCheck = (round) => {
    const points = round.points;
    if (round.completed) {
      if (points > 9) {
        return <div className="spl_outcome spl_win">W</div>;
      } else if (points === 9) {
        return <div className="spl_outcome spl_tie">T</div>;
      } else if (points < 9) {
        return <div className="spl_outcome spl_loss">L</div>;
      }
    }
  };

  const roundScore = (round) => {
    let status;
    if (round.completed) {
      const opponentPoints = 18 - round.points;
      status = `${round.points}-${opponentPoints}`;
    } else {
      status = "-";
    }
    return status;
  };

  return (
    <>
      <TeamHeader teamId={props.selected} />
      <StatCards teamId={props.selected} />
      <div>
        <div className="spl_team-rounds">
          <div className="spl_row-header">
            <div className="spl_70">Round</div>
            <div className="spl_grow">Opponent</div>
            <div className="spl_130">Points</div>
            <div className="spl_70"></div>
          </div>
          {props.selected &&
            teamsData[props.selected].rounds.map((round, index) => {
              return (
                <div className="spl_row" key={index}>
                  <div className="spl_70">{index + 1}</div>
                  <div className="spl_grow">{round.opponent}</div>
                  <div className="spl_130">{roundScore(round)}</div>
                  <div className="spl_70">{completedCheck(round)}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
