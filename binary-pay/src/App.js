import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SelfRegister from "./components/SelfRegister";
import AdminRegister from "./components/AdminRegister";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Settings from "./components/Settings";
/* import ProtectedRoutes from "./components/ProtectedRoutes"; */

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route element={<ProtectedRoutes />}> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
       {/*  </Route> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/self-register" element={<SelfRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
