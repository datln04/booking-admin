import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

//   if (roles && roles.indexOf(user.role) === -1) {
//     // Role not authorized, redirect to unauthorized page
//     alert('You are not authorized to access this page');
//     return <Navigate to="/unauthorized" replace />;
//   }

  // Authorized, render the component
  return <Component {...rest} />;
};

export default PrivateRoute;