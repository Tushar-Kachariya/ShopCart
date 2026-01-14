import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const name = localStorage.getItem("name"); 

  if (!name) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const RedirectIfLoggedIn = ({ children }) => {
  const name = localStorage.getItem("name");
  if (name) return <Navigate to="/admin" replace />; 
  return children;
};


export const RestrictForAdmin = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role==='admin') return <Navigate to="/admin" replace />; 
  return children;
};

export const RestrictForUser = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role==='user') return <Navigate to="/regularUser" replace />; 
  return children;
};


  