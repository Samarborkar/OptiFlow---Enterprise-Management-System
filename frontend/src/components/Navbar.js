import { Link } from 'react-router-dom';
import '../index.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/user';

const Navbar = () => {
  const { login, setLogin, username1, setUsername1 } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedUsername && !username1) {
      setUsername1(storedUsername); 
    }

    if (isLoggedIn && !login) {
      setLogin(true); 
    }
  }, [username1, setUsername1, login, setLogin]);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="Nav">
        <Link to="/home">
          <h1>Optiflow</h1>
        </Link>

        <div className="container2">
          {login ? (
            <>
              <div className="profile-dropdown" onClick={handleDropdownToggle}>
                <button>{username1}</button>
                <div className={`profile-dropdown-content ${dropdownOpen ? 'open' : ''}`}>
                  <Link to="/profile">• View Profile</Link>
                  <Link to="/update_profile">• Update Profile</Link>
                </div>
              </div>
              <Link to="/create_task">Create Task</Link>
              <Link to="/resume_review">Review Resume</Link>
              <Link to="/logout">Logout</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
