import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import '../index.css';

const ForgotForm = () => {
  const [email, setEmail] = useState('');
  const { toggle, setUsername1 } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState(''); 
  const [userEnteredOtp, setUserEnteredOtp] = useState(''); 
  const [otpVerified, setOtpVerified] = useState(false); 
  const [errors, setErrors] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!otpVerified) {
      setErrors({ ...errors, form: 'Please verify OTP before signing up.' });
      return;
    }

    const auth = { email, username, password };

    try {
      const response = await fetch('http://localhost:4000/api/forgot_password', {
        method: 'PATCH',
        body: JSON.stringify(auth),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setErrors(json.errors);
      } else {
        toggle();
        setUsername1(username);
        setErrors({ email: '', username: '', password: '' });
        setEmail('');
        setUsername('');
        setPassword('');
        navigate('/login');
        console.log('Password changed successfully:', json);

      }
    } catch (err) {
      console.error('Request failed:', err);
      setErrors({ ...errors, form: 'Failed to sign up. Please try again later.' });
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true); 
        setServerOtp(data.otp); 
        console.log('OTP sent:', data.otp);
      } else {
        setErrors({ ...errors, email: 'Failed to send OTP. Try again later.' });
      }
    } catch (err) {
      console.error('Failed to send OTP:', err);
    }
  };

  const verifyOtp = () => {
    console.log('Server OTP:', serverOtp); 
    console.log('User Entered OTP:', userEnteredOtp); 
  
    if (userEnteredOtp.trim() === serverOtp.trim()) {
      setOtpVerified(true);
      console.log('OTP verified successfully!');
    } else {
      setOtpVerified(false);
      console.log('Incorrect OTP. Please try again.');
    }
  };
  

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Forgot Password</h3>

      <label>Email:</label>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {errors.email && <div className="error">{errors.email}</div>}

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      {errors.username && <div className="error">{errors.username}</div>}

      <label>New Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {errors.password && <div className="error">{errors.password}</div>}

      <button type="button" onClick={handleSendOtp}>
        {otpSent ? 'Resend OTP' : 'Send OTP'}
      </button>

     
        { otpSent && (<div className="otp-verification">
          <input
            type="text"
            placeholder="Enter OTP"
            value={userEnteredOtp}
            onChange={(e) => setUserEnteredOtp(e.target.value)}
          />
          <button type="button" onClick={verifyOtp}>Verify OTP</button>
          {otpVerified ? (
            <div className="success">OTP verified successfully!</div>
          ) : (
            <div className="error">OTP not verified yet.</div>
          )}
        </div> )}
      

      <button type="submit">Signup</button>
      {errors.form && <div className="error">{errors.form}</div>}

      <a href="./login">Login</a>
    </form>
  );
};

export default ForgotForm;
