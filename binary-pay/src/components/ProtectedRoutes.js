import { Navigate,Outlet} from "react-router-dom";
import { useContext } from "react";
import {TokenContext} from "./SignIn";


const ProtectedRoutes = ()=>{
   const token=useContext(TokenContext)
    return(
        token ? <Outlet/> : <Navigate  to="/"/>
    )   
}

export default ProtectedRoutes;