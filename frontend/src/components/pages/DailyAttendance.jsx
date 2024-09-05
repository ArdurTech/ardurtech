import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import '../styles/DailyAttendance.css';

const DailyAttendance = () => {
    const [workMode, setWorkMode] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [loginTime, setLoginTime] = useState(null);
    const [logoutTime, setLogoutTime] = useState(null);
    const [workedHours, setWorkedHours] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [ipAddress, setIpAddress] = useState('');

    // Format date to MySQL DATETIME format
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };
        fetchIpAddress();
    }, []);

    useEffect(() => {
        let interval = null;
        if (startTime) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
                setWorkedHours(((timer + 1) / 3600).toFixed(2));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, timer]);

    const handleLogin = () => {
        const currentTime = formatDate(new Date());
        setLoginTime(currentTime);
        axios.post('http://localhost:3000/api/attendance', {
            employeeId,
            workMode,
            loginTime: currentTime,
            ipAddress
        })
        .then(response => {
            if (response.data.success) {
                console.log(response.data.message);
                setStartTime(new Date());
            } else {
                console.error(response.data.message);
            }
        })
        .catch(error => {
            console.error('Error logging in:', error);
        });
    };

    const handleLogout = () => {
        const currentTime = new Date().toISOString(); // Use ISO format
        setLogoutTime(currentTime);
        axios.post('http://localhost:3000/api/attendance/logout', {
            logoutTime: currentTime
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    };
    
    

    return (
        <div className="attendance-container">
            <h1 className="attendance-heading">Daily Attendance</h1>
            <div className="attendance-content">
                <img
                    src="https://www.soest.hawaii.edu/UHMC/images/toggles/employees.png"
                    alt="Employee"
                    className="employee-image"
                />
                <div className="attendance-form">
                    <label>Work Mode:</label>
                    <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                    >
                        <option value="">Select Work Mode</option>
                        <option value="Work from Home">Work from Home</option>
                        <option value="Work from Office">Work from Office</option>
                        <option value="Work from Client Location">Work from Client Location</option>
                    </select>
                    
                    {workMode && (
                        <div>
                            <label>Employee ID:</label>
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="attendance-buttons">
                        <button onClick={handleLogin} className="login-button">Login</button>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                    
                    {loginTime && (
                        <div className="time-display">
                            <p>Login Time: {new Date(loginTime).toLocaleString()}</p>
                            <p>Worked Hours: {workedHours} hours</p>
                        </div>
                    )}
                    {logoutTime && (
                        <div className="time-display">
                            <p>Logout Time: {new Date(logoutTime).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyAttendance;
