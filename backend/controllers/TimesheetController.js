
const TimesheetController = async (req, res) => {
  console.log("Request body received:", req.body);

  const rows = req.body.rows; // Expect an array of rows

  if (!Array.isArray(rows) || rows.some(row => !row.employeeName || !row.date || !row.time || !row.taskDetails || !row.assignedBy)) {
    return res.status(400).json({ message: "All fields are required and must be provided in each row" });
  }

  try {
    const pool = req.pool;
    
    // Use a transaction to insert multiple rows
    await pool.query('START TRANSACTION');
    for (const row of rows) {
      await pool.query(
        `INSERT INTO timesheet (employeeName, date, time, taskDetails, assignedBy) 
         VALUES (?, ?, ?, ?, ?)`,
        [row.employeeName, row.date, row.time, row.taskDetails, row.assignedBy]
      );
    }
    await pool.query('COMMIT');

    res.status(201).json({ message: "Timesheet entries added successfully" });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error adding timesheet entries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  TimesheetController,
};
