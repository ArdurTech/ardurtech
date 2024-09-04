import React, { createContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Create the provider component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; // Default export for provider
export { AuthContext };
