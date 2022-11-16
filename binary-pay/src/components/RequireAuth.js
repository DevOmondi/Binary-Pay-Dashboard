import { Navigate } from "react-router-dom";

const RequireAuth = ({loginResponse})=>{
     if(!loginResponse){
        return <Navigate to="/"/>
     }
}

export default RequireAuth;