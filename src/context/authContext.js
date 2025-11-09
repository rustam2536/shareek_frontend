import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [name, setName] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("userAuth");
        
        if (auth) {
            const userAuth = JSON.parse(auth);
            setToken(userAuth.token);
            setUserId(userAuth.userId);
            setSessionId(userAuth.sessionId);
            setName(userAuth.name);
        }

        setIsAuthReady(true);

        return () => {
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                userId,
                sessionId,
                name,
                setToken,
                setUserId,
                setSessionId,
                setName,
                isAuthReady
            }}
        >
            <div>
                {children}
            </div>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
