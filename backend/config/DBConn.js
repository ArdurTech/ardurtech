const mysql = require("mysql2/promise");

const DBConn = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``);
    console.log(`Database ${process.env.DB_DATABASE} created`);

    // Switch to the database
    await pool.query(`USE \`${process.env.DB_DATABASE}\``);
    console.log(`Switched to ${process.env.DB_DATABASE}`);

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`${process.env.DB_TABLENAME}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        employee_id VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log(`${process.env.DB_TABLENAME} table created`);

    // Create employee_details table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`employee_details\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        users_id INT,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        aadhaar VARCHAR(12) NOT NULL UNIQUE,
        pan VARCHAR(10) NOT NULL UNIQUE,
        local_address TEXT NOT NULL,
        permanent_address TEXT NOT NULL,
        age INT NOT NULL,
        education VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (users_id) REFERENCES \`${process.env.DB_TABLENAME}\`(id)
      )
    `);
    console.log(`employee_details table created`);

    // Create timesheet table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`timesheet\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        taskDetails TEXT NOT NULL,
        assignedBy VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(`timesheet table created`);

    // Create attendance table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`attendance\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(255) NOT NULL,
        work_mode ENUM('Work from Home', 'Work from Office', 'Work from Client Location') NOT NULL,
        login_time DATETIME NOT NULL,
        logout_time DATETIME,
        machine_ip VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log(`attendance table created`);

    // Create leave_requests table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`leave_requests\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        employee_id VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        absence_type TEXT NOT NULL,
        reason TEXT,
        absence_from DATE,
        absence_through DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(`leave_requests table created`);

    return pool;

  } catch (error) {
    console.error("Error during database connection:", error);
    throw error;
  }
};

module.exports = DBConn;
