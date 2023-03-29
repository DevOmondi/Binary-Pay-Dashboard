import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const authTkn = sessionStorage.getItem("tkn");

  return authTkn ? children : <Navigate to="/" />;
};
export default ProtectedRoutes;
