import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Settings from "./components/Settings";
//import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {

  return (
    <div className="App">
       <Routes>
          <Route>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
       </Routes>
    </div>
  );
}

export default App;
