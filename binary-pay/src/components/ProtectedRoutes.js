import { Navigate,Outlet} from "react-router-dom";

const ProtectedRoutes = ()=>{
    let auth = {"token": false}

    return(
        auth.token ? <Outlet/> : <Navigate  to="/"/>
    )
     
}

export default ProtectedRoutes;