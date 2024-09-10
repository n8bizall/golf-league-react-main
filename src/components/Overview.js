import React, { useRef, useState } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import { db } from "../firebase";
import { useData } from "../contexts/DataContext";
import { doc, updateDoc } from "firebase/firestore";

export default function Overview(team) {
  const newScoreRef = useRef();
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({
    opponent: "",
    round: 0,
    score: 0,
  });
  const {
    userData,
    teamData,
    setTeamData,
    teamsData,
    setTeamsData,
    setLoading,
  } = useData();

  const editScore = (round, score, opponent) => {
    setSelected({ opponent, round, score });
    setShow(true);
  };

  const updateScore = async (e) => {
    e.preventDefault();
    const user = userData.teamId;
    let points = Number(newScoreRef.current.value);
    let roundsArr = teamData.rounds;
    let updatedRound = roundsArr[selected.round];
    updatedRound.points = points;
    roundsArr[selected.round] = updatedRound;
    let totalPoints = 0;
    roundsArr.forEach((round) => {
      totalPoints += round.points;
    });
    const teamRef = doc(db, "teams", userData.teamId);
    await updateDoc(teamRef, {
      rounds: roundsArr,
      totalPoints: totalPoints,
    });
    setShow(false);
    // Need to update the teams array
    setTeamData({
      rounds: [...teamData.rounds, roundsArr],
      totalPoints: totalPoints,
    });
    setLoading(true);
  };

  const handleClose = () => setShow(false);

  if (!teamsData) {
    return (
      <div>
        <h1>No Data</h1>
      </div>
    );
  }
  return (
    <div>
      <Table responsive>
        <thead>
          <tr>
            <th>Round</th>
            <th>Opponent</th>
            <th>Points Earned</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {team.data.rounds &&
            team.data.rounds.map((round, index) => (
              <tr key={index}>
                <td>Round {index + 1}</td>
                <td>{round.opponent}</td>
                <td>{round.points}</td>
                <td>
                  <Button
                    onClick={() =>
                      editScore(index, round.points, round.opponent)
                    }
                    variant="link"
                    size="sm"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            Round {selected.round + 1} - {selected.opponent}
          </h4>
          <Form onSubmit={updateScore}>
            <Form.Group className="mb-4" id="points">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="18"
                ref={newScoreRef}
                required
              />
            </Form.Group>
            <Button className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
