import CalendarDisplay from "./components/calendar/CalendarDisplay";
import LoginForm from "./auth/LoginPage.jsx";
import {AuthProvider} from "./auth/authContext.jsx";
import React from 'react';
import RegistrationPage from "./auth/RegistrationPage.jsx";

function App() {
  return (
    <>
        <AuthProvider>
            
                <LoginForm/>  
            <RegistrationPage/>
            
        </AuthProvider>
    </>
  );
}

export default App;
