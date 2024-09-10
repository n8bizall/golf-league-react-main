import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const FrontNineScorecard = ({ userId, isAdmin }) => {
  const [scores, setScores] = useState({
    hole1: 0,
    hole2: 0,
    hole3: 0,
    hole4: 0,
    hole5: 0,
    hole6: 0,
    hole7: 0,
    hole8: 0,
    hole9: 0,
  });

  useEffect(() => {
    // Fetch scores from Firestore if available for the user
    const fetchScores = async () => {
      const docRef = doc(db, "scorecards", `${userId}-front9`);
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
    const docRef = doc(db, "scorecards", `${userId}-front9`);
    await setDoc(docRef, scores, { merge: true });
    alert("Scores saved successfully!");
  };

  return (
    <div className="scorecard">
      <h2>Front 9 Scorecard</h2>
      <table>
        <thead>
          <tr>
            <th>Hole</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Score</td>
            {Object.keys(scores).map((hole, index) => (
              <td key={index}>
                <input
                  type="number"
                  name={`hole${index + 1}`}
                  value={scores[`hole${index + 1}`]}
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

export default FrontNineScorecard;
