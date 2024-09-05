const EmployeeDetailsController = async (req, res) => {
  const {
    fullName,
    email,
    gender,
    aadhaar,
    pan,
    local_address,
    permanent_address,
    age,
    education,
  } = req.body;

  if (
    !fullName ||
    !email ||
    !gender ||
    !aadhaar ||
    !pan ||
    !local_address ||
    !permanent_address ||
    !age ||
    !education
  ) {
    console.log("Validation failed:", { fullName, email, gender, aadhaarNo, panCardNo, localAddress, permanentAddress, age, education });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = req.pool;

    // Check if email or aadhaar already exists
    const [existingEmployee] = await pool.query(
      `SELECT * FROM employee_details WHERE email = ? OR aadhaar = ?`,
      [email, aadhaar]
    );

    if (existingEmployee.length > 0) {
      return res
        .status(409)
        .json({ message: "Employee details with this email or Aadhaar already exist" });
    }

    // Insert the new employee details
    const [result] = await pool.query(
      `INSERT INTO employee_details (fullname, email, gender, aadhaar, pan, local_address, permanent_address, age, education) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, gender, aadhaar, pan, local_address, permanent_address, age, education]
    );

    console.log("Employee details successfully inserted:", result);
res.status(201).json({
  message: "Employee details added successfully",
  data: result,
});

   
  } catch (error) {
    console.error("Error adding employee details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  EmployeeDetailsController,
};
