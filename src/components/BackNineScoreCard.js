import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const BackNineScorecard = ({ userId, isAdmin }) => {
  const [scores, setScores] = useState({
    hole10: 0,
    hole11: 0,
    hole12: 0,
    hole13: 0,
    hole14: 0,
    hole15: 0,
    hole16: 0,
    hole17: 0,
    hole18: 0,
  });

  useEffect(() => {
    // Fetch scores from Firestore if available for the user
    const fetchScores = async () => {
      const docRef = doc(db, "scorecards", `${userId}-back9`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setScores(docSnap.data());
      }
    };
    fetchScores();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScores({ ...scores, [name]: parseInt(value, 10) });
  };

  const saveScores = async () => {
    const docRef = doc(db, "scorecards", `${userId}-back9`);
    await setDoc(docRef, scores, { merge: true });
    alert("Scores saved successfully!");
  };

  return (
    <div className="scorecard">
      <h2>Back 9 Scorecard</h2>
      <table>
        <thead>
          <tr>
            <th>Hole</th>
            <th>10</th>
            <th>11</th>
            <th>12</th>
            <th>13</th>
            <th>14</th>
            <th>15</th>
            <th>16</th>
            <th>17</th>
            <th>18</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Score</td>
            {Object.keys(scores).map((hole, index) => (
              <td key={index}>
                <input
                  type="number"
                  name={`hole${index + 10}`}
                  value={scores[`hole${index + 10}`]}
                  onChange={handleChange}
                  disabled={!isAdmin && userId !== "teammateId"}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <button onClick={saveScores}>Save Scores</button>
    </div>
  );
};

export default BackNineScorecard;
