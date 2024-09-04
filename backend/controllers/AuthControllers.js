const bcrypt = require("bcryptjs"); // for hashing user's password
const token = require("../utils/jwt"); // utility for generating JWT
const { sendEmail } = require("../utils/email"); // utility for sending emails
const crypto = require("crypto"); // for generating unique employee IDs

// Helper function to generate unique employee ID
const generateEmployeeId = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// SignUpController: Handles user registration
const SignUpController = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if username already exists
    const [checkUsername] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE username = ?`,
      [username]
    );
    if (checkUsername[0].count > 0) {
      return res.status(400).send("User with the same username already exists");
    }

    // Check if email already exists
    const [checkEmail] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE email = ?`,
      [email]
    );
    if (checkEmail[0].count > 0) {
      return res.status(400).send("User with the same email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique Employee ID
    const employeeId = generateEmployeeId();

    // Insert new user into the database
    const [insertUser] = await req.pool.query(
      `INSERT INTO \`${process.env.DB_TABLENAME}\` (username, email, password, employee_id) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, employeeId]
    );

    // Send Employee ID to the user via email
    await sendEmail(email, "Your Employee ID", `Your Employee ID is ${employeeId}`);

    // Send success response with user details
    res.status(201).json({ id: insertUser.insertId, username, email, employeeId });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

// LoginController: Handles user login
const LoginController = async (req, res) => {
  const { password, employeeId } = req.body;

  // Validate inputs
  if (!password || !employeeId) {
    return res.status(400).send("Employee ID and Password are required");
  }

  try {
    // Check if user exists by employee ID
    const [checkUser] = await req.pool.query(
      `SELECT * FROM ${process.env.DB_TABLENAME} WHERE employee_id = ?`,
      [employeeId]
    );
    
    // If no user is found
    if (checkUser.length === 0) {
      return res.status(400).send("User with this Employee ID doesn't exist");
    }

    // Get user details
    const foundUser = checkUser[0];

    // Compare provided password with stored hashed password
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      return res.status(401).send("Incorrect password");
    }

    // Generate and send JWT
    token(foundUser, res);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
};

// EmployeeDetailsController: Handles employee details submission
const EmployeeDetailsController = async (req, res) => {
  const { fullName, email, gender, aadhaarNo, panCardNo, localAddress, permanentAddress, age, education } = req.body;

  // Validate inputs
  if (!fullName || !email || !gender || !aadhaarNo || !panCardNo || !localAddress || !permanentAddress || !age || !education) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Insert employee details into the database
    console.log("Inserting employee details:", req.body);
    await req.pool.query(
      `INSERT INTO employee_details (full_name, email, gender, aadhaar_no, pan_card_no, local_address, permanent_address, age, education) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, gender, aadhaarNo, panCardNo, localAddress, permanentAddress, age, education]
    );
    console.log("Employee details added successfully.");
    res.status(201).send("Employee details added successfully");
  } catch (error) {
    console.error("Error adding employee details:", error);
    res.status(500).send("Internal Server Error");
  }
};


// Export all controllers in a single module.exports statement
module.exports = { SignUpController, LoginController, EmployeeDetailsController };
