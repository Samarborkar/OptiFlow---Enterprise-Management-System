import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Make sure this is the correct import
import Navbar from '../components/Navbar';

const Profile = () => {
  const [userData, setUserData] = useState({ username: '', designation: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleToken = () => {
      try {
        // Extract token from cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        const tokenValue = token.split('=')[1];

        // Decode the JWT token
        const decoded = jwtDecode(tokenValue);
        console.log('Decoded token:', decoded);

        // Extract username and designation directly from the decoded token
        // Adjust this based on the actual structure of your token
        const username =localStorage.getItem('username');; // Change based on the structure
        const designation = decoded.designation; // Change based on the structure
        console.log('Username:', username, 'Designation:', designation);
        
        setUserData({ username, designation });
        setLoading(false);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };

    // Decode the token and extract user information
    handleToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="spacer2"></div>
    <div className="profile">
      <h2>Profile</h2>
      <p><strong>Username:</strong> {userData.username || 'Not available'}</p>
      <p><strong>Designation:</strong> {userData.designation || 'Not available'}</p>
    </div>
    </div>
  );
};

export default Profile;
