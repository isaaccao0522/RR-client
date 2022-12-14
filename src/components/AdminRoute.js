import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

//Components
import { Store } from '../Store';


export const AdminRoute = ( { children }) => {
  const { state } = useContext ( Store);
  const { userInfo } = state;

  
  return (
    userInfo ? children : <Navigate to="/signin" />
  );
};

export default AdminRoute;