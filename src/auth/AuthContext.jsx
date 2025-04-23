import {createContext, useContext, useState, useEffect, useMemo, useCallback} from "react";
import SessionTimeoutWarning from "./SessionTimeoutWarning.jsx";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionTimeout, setSessionTimeout ] = useState(null);
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    

    const parseJwt = (token) => {
        try{
            return JSON.parse(atob(token.split('.')[1]));
        } catch(e){
            return null;
        }
    };
    
    
        const verifyToken = useCallback(async () => {
            try {
                const token = sessionStorage.getItem("authToken");
                if(!token){
                    setUser(null);
                    setIsLoading(false);
                    return false;
                }
                
                const userData = parseJwt(token);
                if (!userData || userData.exp * 1000 <= Date.now()) {
                    sessionStorage.removeItem("authToken");
                    setUser(null);
                    setIsLoading(false);
                    return false;
                } else{
                    setUser({
                        id: userData.sub || userData.id,
                        email: userData.email,
                        name: userData.name,
                    });
                    setIsLoading(false);
                    return true;
                }
            } catch(error){
                console.error('Token verification error:' ,error);
                sessionStorage.removeItem("authToken");
                setUser(null);
                setIsLoading(false);
                return false;
            }
            },[]);
        
        const checkTokenAge = useCallback(() => {
            const token = sessionStorage.getItem("authToken");
            if(!token) return false;
            
            const payload = parseJwt(token);
            if(!payload || !payload.iat) return false;
            
            const issuedAt = payload.iat * 1000;
            const currentTime = Date.now();
            const tokenAge = currentTime - issuedAt;
            
            const MAX_TOKEN_AGE = 4 * 60 * 60 * 1000;
            return tokenAge <= MAX_TOKEN_AGE;
        }, []);
        
        const extendSession = useCallback(() => {
            if (sessionTimeout){
                clearTimeout(sessionTimeout);
                setSessionTimeout (null);
            }
            setShowSessionWarning(false);
        }, [sessionTimeout]);
        
        useEffect(() => {
            verifyToken();
        }, [verifyToken]);

        useEffect(() => {
            const interval = setInterval(() => {
                if (!checkTokenAge() && !sessionTimeout && user){
                    setShowSessionWarning(true);
                    const timeout = setTimeout(() => {
                        logout();
                        //Redirect to login
                    }, 5 * 60 *1000); // 5 min warning
                    setSessionTimeout (timeout);
                    //Display message to user if Token is getting old, "5 min left of session"
                }
            }, 15 * 60 *1000); //How often to check if valid
            return () => {
                clearInterval(interval);
                if (sessionTimeout) clearTimeout(sessionTimeout);
            };
        }, [checkTokenAge, sessionTimeout, user]);

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/fetch/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            console.log('Login response', data);

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText || 'Inloggning misslyckades');
            }
            
            let token = null;
            if (data.token) {
                token = data.token;
            } else if (data.data?.token) {
                token = data.data.token;
            } else if (data.result?.token) {
                token = data.result.token;
            }
            
            if(!token){
                console.error('Unexpected response structure', data);
                throw new Error('Authentication failed: Invalid token response');
            }
            sessionStorage.setItem("authToken", data.token);
            await verifyToken();
            return true;
        } catch(error){
            console.error('Login error:' ,error);
            throw error;
        }finally {
            setIsLoading(false);
        }
    };
    
    const logout = useCallback(() => {
        sessionStorage.removeItem("authToken");
        setUser(null);
        setShowSessionWarning(false);
        if(sessionTimeout){
            clearTimeout(sessionTimeout);
            setSessionTimeout(null);
        }
    }, [sessionTimeout]);
    
    const authFetch = useCallback(async (url, options = {}) => {
        const isValid = await verifyToken();
        if(!isValid) {
            throw new Error('Session expired. Please log in again.');
        }
 
        const token = sessionStorage.getItem("authToken");
        
        const authOptions = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            }
        };
        
        const response = await fetch(url, authOptions);
        
        if (response.status === 401) {
            logout();
            throw new Error('Session expired. Please log in again.');
        }
        return response;
    }, [verifyToken, logout]);
    
    const authContextValue = useMemo(
        () => ({
            user,
            isLoading,
            login,
            logout,
            authFetch,
            verifyToken,
            checkTokenAge,
            extendSession,
            isAuthenticated: !!user,
            showSessionWarning
        }),
        [user, isLoading, logout, authFetch, verifyToken, checkTokenAge, extendSession, showSessionWarning]
    );
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
            {showSessionWarning && (
                <SessionTimeoutWarning onExtend={extendSession} onLogout={logout} />)}
        </AuthContext.Provider>
    );
};

