import CalendarDisplay from "./components/calendar/CalendarDisplay";
import LoginForm from "./auth/loginForm.jsx";
import {AuthProvider} from "./auth/authContext.jsx";

function App() {
  return (
    <>
        <AuthProvider>
            <div>
                <LoginForm />  
            </div>
        </AuthProvider>
    </>
  );
}

export default App;
