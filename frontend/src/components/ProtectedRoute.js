import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure the correct import

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute useEffect running");

    const handleToken = () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      console.log('Token found in cookie:', token);

      if (token) {
        const tokenValue = token.split('=')[1];
        try {
          const decoded = jwtDecode(tokenValue);
          console.log('Decoded token:', decoded);

          // Set authentication and admin status
          setIsAuthenticated(true);
          setIsAdmin(decoded.admin); // Update admin status
          
          console.log("User authenticated, Admin status:", decoded.admin);
        } catch (error) {
          console.log('Token is invalid or expired.', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log("No token found, redirecting to login");
        setIsAuthenticated(false);
      }

      // Set loading to false after processing
      setLoading(false);
    };

    // Decode the token and update the states
    handleToken();
  }, []); // Empty dependency array since nothing is being passed from props

  // Render loading state if processing token
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // Redirect to /login_admin if the route is admin-only but user isn't an admin
  if (adminOnly && !isAdmin) {
    console.log("Admin-only route, but user is not an admin. Redirecting to /login_admin");
    return <Navigate to="/login_admin" />;
  }

  // Redirect to /login if user is not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /login");
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
