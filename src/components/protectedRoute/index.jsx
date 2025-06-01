import { Navigate } from "react-router-dom";
import { userService } from "../../utils/userService.jsx";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const user = userService.userValue;

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  // Vérifier si l'utilisateur a le rôle requis
  if (user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
