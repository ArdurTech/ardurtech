// Handle POST request for Leave Request
const LeaveRequestController = async (req, res) => {
  const {
    firstName,
    lastName,
    employeeId,
    department,
    date,
    absenceType,
    reason,
    absenceFrom,
    absenceThrough
  } = req.body;

  // Insert query
if
(   
   !firstName,
    !lastName,
    !employeeId,
    !department,
    !date,
    !absenceType,
    !reason,
    !absenceFrom,
    !absenceThrough
) {
  return res.status(400).json({message:"All fiels are Require"});
}
  // Execute query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Failed to submit leave request' });
    }
    res.status(200).json({ message: 'Leave request submitted successfully' });
  });
};

module.exports = {
  LeaveRequestController,
};