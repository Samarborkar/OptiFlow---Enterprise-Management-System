import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });
  const navigate = useNavigate();
  const { login, toggle, username1, setUsername1, setTokenId, setTokenName, setTokenDesig, setTokenAdmin } = useContext(UserContext);

  const validateInputs = () => {
    let valid = true;
    const newErrors = { email: '', password: '', form: '' };

    if (!email) {
      newErrors.email = 'Please enter your email.';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const auth = { email, password };

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        body: JSON.stringify(auth),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (!response.ok) {
        // Error handling for account not found or incorrect credentials
        if (json.error === 'Account does not exist') {
          setErrors({ ...errors, form: 'Account not found. Please sign up.' });
        } else if (json.error === 'Incorrect credentials') {
          setErrors({ ...errors, form: 'Email or password is incorrect. Please try again.' });
        } else {
          setErrors({ ...errors, form: 'An error occurred. Please try again.' });
        }
      } else {
        toggle();
        const { username } = json;
        setUsername1(username);
        localStorage.setItem('username', username);
        localStorage.setItem('isLoggedIn', 'true');

        const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
        if (token) {
          const tokenValue = token.split('=')[1];
          try {
            const decoded = jwtDecode(tokenValue);
            setTokenId(decoded.id);
            setTokenDesig(decoded.designation);
            setTokenAdmin(decoded.admin);
            setTokenName(decoded.username);
          } catch (error) {
            console.log('Token is invalid or expired.', error);
          }
        } else {
          console.log('No token found, redirecting to login');
        }

        setEmail('');
        setPassword('');
        navigate('/home');
      }
    } catch (err) {
      console.error('Request failed:', err);
      setErrors({ ...errors, form: 'Failed to log in. Please try again later.' });
    }
  };

  return (
    <div className="form_container">
      <form className="create" onSubmit={HandleSubmit}>
        <h3>Login</h3>

        <label>Email:</label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {errors.email && <div className="error">{errors.email}</div>}

        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {errors.password && <div className="error">{errors.password}</div>}

        <button type="submit">Login</button>
        <Link to="/signup">Signup</Link>
        <Link to="/forgot_password">Forgot password</Link>
        {errors.form && <div className="error">{errors.form}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
