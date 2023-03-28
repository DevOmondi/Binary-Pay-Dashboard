import { Navigate} from "react-router-dom";
import { useContext } from "react";
import {TokenContext} from "../App";


const ProtectedRoutes = ({children})=>{
   const tokenContext=useContext(TokenContext)
   console.log("some :", tokenContext.token);
    // if (tokenContext.token===null){
    // return <Navigate to="/"/>
    // }
    // return children;
    return (
        tokenContext.token ? children : <Navigate to="/"/>
    )
}
export default ProtectedRoutes;