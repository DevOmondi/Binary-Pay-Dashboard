import { Navigate,Outlet} from "react-router-dom";
import { useContext } from "react";
import {TokenContext} from "../App";


const ProtectedRoutes = ()=>{
   const tokenContext=useContext(TokenContext)
   console.log("some :", tokenContext);
    return(
        tokenContext.token ? <Outlet/> : <Navigate  to="/"/>
    )   
}

export default ProtectedRoutes;