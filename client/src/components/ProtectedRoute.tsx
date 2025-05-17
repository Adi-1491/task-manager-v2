import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }): JSX.Element => {  // defining a protected route reusable component which return children as a JSX element
    const token = localStorage.getItem('token');
    if(!token)
    {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>; //return children means returning the jsx component that is wrapped inside protected route tag (returning in fragment to be safe)
    
};

export default ProtectedRoute;
