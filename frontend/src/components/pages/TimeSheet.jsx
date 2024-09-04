import { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import styles from "../styles/Timesheet.module.css";


function Timesheet() {
  const [rows, setRows] = useState([
    { employeeName: "", date: "", time: "", taskDetails: "", assignedBy: "" }
  ]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [name]: value };
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { employeeName: "", date: "", time: "", taskDetails: "", assignedBy: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting rows:", rows);
    try {
      const response = await axios.post("http://localhost:3000/api/timesheet", { rows });
      console.log(response.data.message); // Handle success message
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };
  

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Timesheet Entry</h1>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Task Details</th>
                <th>Assigned By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  
                  <td><input type="text" name="employeeName" value={row.employeeName} onChange={(e) => handleChange(index, e)} placeholder="Employee Name" required /></td>
                  <td><input type="date" name="date" value={row.date} onChange={(e) => handleChange(index, e)} required /></td>
                  <td><input type="time" name="time" value={row.time} onChange={(e) => handleChange(index, e)} required /></td>
                  <td><input type="text" name="taskDetails" value={row.taskDetails} onChange={(e) => handleChange(index, e)} placeholder="Task Details" required /></td>
                  <td><input type="text" name="assignedBy" value={row.assignedBy} onChange={(e) => handleChange(index, e)} placeholder="Assigned By" required /></td>
                  <td>
                    {index === rows.length - 1 && (
                      <button type="button" onClick={handleAddRow}>Add Row</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttons}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Timesheet;
