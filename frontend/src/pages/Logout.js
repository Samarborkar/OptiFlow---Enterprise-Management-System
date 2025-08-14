import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/logout', {
          method: 'POST', // You might use GET or POST depending on your backend implementation
          credentials: 'include', // Ensure cookies are included in the request
        });

        if (response.ok) {
          console.log('User logged out successfully');
          navigate('/'); // Redirect to login page after logout
        } else {
          console.error('Failed to log out');
        }
      } catch (error) {
        console.error('An error occurred during logout:', error);
      }
    };

    // Automatically call the logout function on component mount
    logoutUser();
  }, [navigate]);

  return (
    <div>
      <h3>Logging out...</h3>
      {/* Optionally, you can display a spinner or loading message */}
    </div>
  );
};

export default Logout;
