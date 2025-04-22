import {createContext, useContext, useState, useEffect, useMemo, useCallback} from "react";

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
            const response = await fetch('/api/fetch/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(response.statusText);
            }
            sessionStorage.setItem("authToken", data.token);

            await verifyToken();
            
            return true;
        } catch(error){
            console.error('Login error:' ,error);
            throw error;
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

const SessionTimeoutWarning = ({ onExtend, onLogout }) => {
    return(
        <div className="fixed bottom-4 right-4 bg-amber-50 border border-amber-300 rounded-lg shadow-lg p-4 max-w-md z-50">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-amber-800">Sessionsvarning</h3>
                    <div className="mt-2 text-sm text-amber-700">
                        <p>Din session är gammal. Du kommer att loggas ut automatiskt inom 5 minuter.</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onExtend}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Förläng session
                        </button>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Logga ut
                        </button>
                    </div>
                </div>
            </div>
        </div>    
    );
};