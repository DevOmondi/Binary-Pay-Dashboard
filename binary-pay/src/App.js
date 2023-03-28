import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState,createContext} from "react";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SelfRegister from "./components/SelfRegister";
import AdminRegister from "./components/AdminRegister";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Settings from "./components/Settings";
import ProtectedRoutes from "./components/ProtectedRoutes"; 

//create token context
export const TokenContext=createContext();

function App() {
//implement token state
const [token, setToken]=useState(null);

  return (
    <div className="App">
      {/* wrap calling components in provider  */}
     <TokenContext.Provider value={{token,setToken}}>
     <Routes>
        {/* <Route element={<ProtectedRoutes/>}>  */}
           <Route path="/dashboard" element={<Dashboard />} />
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
      </Routes>
     </TokenContext.Provider>
    </div>
  );
}

export default App;
