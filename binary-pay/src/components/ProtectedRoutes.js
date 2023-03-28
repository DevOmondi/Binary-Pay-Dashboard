import { Navigate,Outlet} from "react-router-dom";
import { useContext } from "react";
import {TokenContext} from "../App";


const ProtectedRoutes = ()=>{
   const tokenContext=useContext(TokenContext)
   console.log("some :", tokenContext.token);
    // if (tokenContext.token===null){
    // return <Navigate to="/"/>
    // }
    // return children;
    return (
        tokenContext.token ? <Outlet/> : <Navigate to="/"/>
    )
}
export default ProtectedRoutes;