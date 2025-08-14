import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import '../index.css';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const { toggle, setUsername1 } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState(''); // New field for designation
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({ email: '', username: '', password: '', designation: '', form: '' });
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = { email: '', username: '', password: '', designation: '', form: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (!designation.trim()) {
      newErrors.designation = 'Designation is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setErrors({ ...errors, form: 'Please verify OTP before signing up.' });
      return;
    }

    if (!validateFields()) return;

    const auth = { email, username, password, designation }; // Added designation

    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        body: JSON.stringify(auth),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setErrors((prevErrors) => ({ ...prevErrors, form: json.errors.form || 'Failed to sign up. Please try again.' }));
      } else {
        toggle();
        setUsername1(username);
        setErrors({ email: '', username: '', password: '', designation: '', form: '' });
        setEmail('');
        setUsername('');
        setPassword('');
        setDesignation(''); // Clear the designation field
        navigate('/');
        console.log('Signup successful:', json);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setErrors({ ...errors, form: 'Failed to sign up. Please try again later.' });
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter your email to receive OTP.' }));
      return;
    }

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
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Failed to send OTP. Try again later.' }));
      }
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Error sending OTP. Please try again.' }));
    }
  };

  const verifyOtp = () => {
    if (!userEnteredOtp.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, form: 'Please enter the OTP.' }));
      return;
    }

    if (userEnteredOtp.trim() === serverOtp.trim()) {
      setOtpVerified(true);
      setErrors((prevErrors) => ({ ...prevErrors, form: '' }));
      console.log('OTP verified successfully!');
    } else {
      setOtpVerified(false);
      setErrors((prevErrors) => ({ ...prevErrors, form: 'Incorrect OTP. Please try again.' }));
      console.log('Incorrect OTP. Please try again.');
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Sign-Up</h3>

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

      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {errors.password && <div className="error">{errors.password}</div>}

      <label>Designation:</label> {/* New field */}
      <input
        type="text"
        onChange={(e) => setDesignation(e.target.value)}
        value={designation}
      />
      {errors.designation && <div className="error">{errors.designation}</div>}

      <button type="button" onClick={handleSendOtp}>
        {otpSent ? 'Resend OTP' : 'Send OTP'}
      </button>

      {otpSent && (
        <div className="otp-verification">
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
        </div>
      )}

      <button type="submit">Signup</button>
      {errors.form && <div className="error">{errors.form}</div>}

      <a href="./login">Login</a>
      <a href="./forgot_password">Forgot Password</a>
    </form>
  );
};

export default SignupForm;
