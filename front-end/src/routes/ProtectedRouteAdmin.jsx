/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../context/authContext';

const ProtectedRouteAdmin = ({ children, allowedRoles }) => {
  const { token, role } = useContext(authContext);
  const isAllowed = allowedRoles.includes(role);
  
  if (!token || !isAllowed) {
    return <Navigate to="/login" replace={true} />;
  }

  return children; 
};

export default ProtectedRouteAdmin;
