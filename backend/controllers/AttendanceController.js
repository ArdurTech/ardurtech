const handleLogin = (req, res) => {
    const { employeeId, workMode, loginTime, ipAddress } = req.body;

    if (!employeeId || !workMode || !loginTime) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = 'INSERT INTO attendance (employee_id, work_mode, login_time, ip_address) VALUES (?, ?, ?, ?)';
    req.pool.query(insertQuery, [employeeId, workMode, loginTime, ipAddress], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Logged in successfully' });
    });
};

const handleLogout = async (req, res) => {
    const { logoutTime } = req.body;

    if (!logoutTime) {
        return res.status(400).json({ message: 'Logout time is required' });
    }

    try {
        // Convert logoutTime to MySQL-compatible format
        const logoutTimeFormatted = new Date(logoutTime).toISOString().slice(0, 19).replace('T', ' ');

        // Find the most recent login record without a logout time
        const [selectResults] = await req.pool.query(`
            SELECT id FROM attendance
            WHERE logout_time IS NULL
            ORDER BY login_time DESC
            LIMIT 1
        `);

        if (selectResults.length === 0) {
            return res.status(404).json({ message: 'No login record found' });
        }

        const attendanceId = selectResults[0].id;

        // Update the logout time for the found record
        await req.pool.query(`
            UPDATE attendance 
            SET logout_time = ? 
            WHERE id = ?
        `, [logoutTimeFormatted, attendanceId]);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error handling logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = {
    handleLogin,
    handleLogout
};
