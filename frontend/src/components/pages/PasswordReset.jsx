import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PasswordReset.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token'));
    const [message, setMessage] = useState('');
    const [isResetMode, setIsResetMode] = useState(!!token);

    useEffect(() => {
        if (token) {
            setIsResetMode(true);
        }
    }, [token]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage('Reset link sent to your email.');
        } catch (error) {
            setMessage('Error sending reset link.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', { token, newPassword });
            setMessage('Password has been reset.');
        } catch (error) {
            setMessage('Error resetting password.');
        }
    };

    return (
        <div className="password-reset-container">
            {isResetMode ? (
                <form onSubmit={handleResetPassword}>
                    <h2>Reset Password</h2>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                    {message && <p>{message}</p>}
                </form>
            ) : (
                <form onSubmit={handleForgotPassword}>
                    <h2>Forgot Password</h2>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                    {message && <p>{message}</p>}
                </form>
            )}
        </div>
    );
};

export default PasswordReset;
