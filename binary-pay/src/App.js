import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SelfRegister from "./components/SelfRegister";
import AdminRegister from "./components/AdminRegister";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
<<<<<<< HEAD
// import Settings from "./components/Settings";
import ProtectedRoutes from "./components/ProtectedRoutes"; 

//create token context
export const TokenContext=createContext();
=======
import Settings from "./components/Settings";
import ProtectedRoutes from "./components/ProtectedRoutes";
>>>>>>> 52167a123ff0f8745e1537fcb0f556b9fef9a20f

function App() {
  return (
    <div className="App">
      {/* wrap calling components in provider  */}
<<<<<<< HEAD
     <TokenContext.Provider value={{token,setToken}}>
     <Routes>
           <Route element={<ProtectedRoutes/>}> 
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-register"element={<AdminRegister />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/self-register" element={<SelfRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
           </Route>
           <Route path="/" element={<SignIn />} />
=======
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
        {/* <Route 
            path="/settings"
            element={
                      <ProtectedRoutes>
                          <Settings/>
                      </ProtectedRoutes>
                    } 
            />  */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/self-register" element={<SelfRegister />} />
        <Route
          path="/admin-register"
          element={
            <ProtectedRoutes>
              <AdminRegister />
            </ProtectedRoutes>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
>>>>>>> 52167a123ff0f8745e1537fcb0f556b9fef9a20f
      </Routes>
    </div>
  );
}

export default App;
