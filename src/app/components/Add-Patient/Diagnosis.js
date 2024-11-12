import { useState } from "react";
import { Button } from "../HomeUi/button";

export default function Diagnosis({ diagnosisData, onAddDiagnosis, onRemoveDiagnosis , convertDiagnosis = null}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [aType, setAType] = useState(false);
  if (convertDiagnosis){
    setDiagnosis(convertDiagnosis)
  }
  const addDiagnosis = () => {
    if (diagnosis) {
      onAddDiagnosis({ diagnosis, aType });
      setDiagnosis(""); // Reset diagnosis input
      setAType(false); // Reset aType input
    } else {
      alert("Please enter a diagnosis.");
    }
  };

  return (
    <div>
      {/* Diagnosis Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Diagnosis</th>
            <th style={styles.header}>Atypical?</th>
            <th style={styles.header}>Action</th>
          </tr>
        </thead>
        <tbody>
          {diagnosisData.map((item, index) => (
            <tr key={index}>
              <td style={styles.cell}>{item.diagnosis}</td>
              <td style={styles.checkboxCell}>
                <input type="checkbox" checked={item.aType} disabled />
              </td>
              <td style={styles.cell}>
                <Button type="button" onClick={() => onRemoveDiagnosis(index)} style={styles.removeButton}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
        {/* Input row aligned with headers */}
        <tr>
          <td>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter Diagnosis..."
              style={styles.input}
            />
          </td>
          <td style={styles.checkboxCell}>
            <label>
              <input
                type="checkbox"
                checked={aType}
                onChange={(e) => setAType(e.target.checked)}
              />
            </label>
          </td>
          <td>
            <Button type="button" onClick={addDiagnosis} style={styles.addButton}>
              Add Diagnosis
            </Button>
          </td>
        </tr>
        </tfoot>
      </table>
    </div>
  );
}

const styles = {
  table: {
    borderCollapse: "collapse",
    width: "100%",
    fontFamily: "inherit",
  },
  header: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "16px",
    paddingBottom: "8px",
    color: "#4A4A4A", // Adjust to match your form's color
  },
  cell: {
    padding: "8px",
  },
  checkboxCell: {
    textAlign: "center",
    padding: "8px",
  },
  input: {
    width: "75%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    fontFamily: "inherit",
  },
  addButton: {
    width: "100%",
    fontSize: "14px",
    padding: "8px",
  },
  removeButton: {
    width: "100%",
    fontSize: "14px",
    padding: "8px",
    backgroundColor: "red",
  },
};
