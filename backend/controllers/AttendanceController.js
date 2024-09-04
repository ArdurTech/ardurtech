const handleLogin = (req, res) => {
    const { employeeId, workMode, loginTime, ipAddress } = req.body;

    if (!employeeId || !workMode || !loginTime || !ipAddress) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the employee ID exists in the users table
    const checkEmployeeQuery = 'SELECT id FROM users WHERE employee_id = ?';
    req.pool.query(checkEmployeeQuery, [employeeId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Database error:', checkError);
            return res.status(500).json({ message: 'Database error' });
        }

        if (checkResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee ID not found' });
        }

        // Insert login record
        const insertQuery = 'INSERT INTO attendance (employee_id, work_mode, login_time, ip_address) VALUES (?, ?, ?, ?)';
        req.pool.query(insertQuery, [employeeId, workMode, loginTime, ipAddress], (insertError, insertResults) => {
            if (insertError) {
                console.error('Database error:', insertError);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ success: true, message: 'Logged in successfully' });
        });
    });
};

const handleLogout = (req, res) => {
    const { employeeId, logoutTime, ipAddress } = req.body;

    if (!employeeId || !logoutTime || !ipAddress) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the latest login record for the employee
    const selectQuery = 'SELECT id FROM attendance WHERE employee_id = ? AND logout_time IS NULL ORDER BY login_time DESC LIMIT 1';
    req.pool.query(selectQuery, [employeeId], (selectError, selectResults) => {
        if (selectError) {
            console.error('Database error:', selectError);
            return res.status(500).json({ message: 'Database error' });
        }

        if (selectResults.length === 0) {
            return res.status(404).json({ message: 'No login record found' });
        }

        const attendanceId = selectResults[0].id;

        // Update the logout time for the found record
        const updateQuery = 'UPDATE attendance SET logout_time = ? WHERE id = ?';
        req.pool.query(updateQuery, [logoutTime, attendanceId], (updateError, updateResults) => {
            if (updateError) {
                console.error('Database error:', updateError);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
};

module.exports = {
    handleLogin,
    handleLogout
};
