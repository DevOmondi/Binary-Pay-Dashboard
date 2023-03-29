import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
import SelfRegister from "./components/SelfRegister";
import AdminRegister from "./components/AdminRegister";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Settings from "./components/Settings";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <div className="App">
      {/* wrap calling components in provider  */}
      <Routes>
        {/* <Route element={<ProtectedRoutes/>}>  */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
         <Route 
            path="/settings"
            element={
            <ProtectedRoutes>
                <Settings/>
            </ProtectedRoutes>
          } 
            /> 
        <Route path="/" element={<SignIn />} />
        {/* <Route 
          path="/signup" 
          element={
            <ProtectedRoutes>
              <SignUp />
            </ProtectedRoutes>
          }
        /> */}
        <Route 
          path="/self-register"
          element={
            <ProtectedRoutes>
              <SelfRegister />
            </ProtectedRoutes>
          }
           />
        <Route
          path="/admin-register"
          element={
            <ProtectedRoutes>
              <AdminRegister />
            </ProtectedRoutes>
          }
        />
        <Route
         path="/forgot-password"
         element={
            <ProtectedRoutes>
              <ForgotPassword />
            </ProtectedRoutes>
          }
           />
        <Route
         path="/reset-password"
          element={
            <ProtectedRoutes>
              <ResetPassword/>
            </ProtectedRoutes>
          } 
          />
      </Routes>
    </div>
  );
}

export default App;
