// LandingPage.js
import React, { useEffect, useState } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import Typewriter from 'typewriter-effect';
import '../index.css';
import Image from "../images/Home_Image.png";
import LoginForm from './LoginForm'; // Import LoginForm
import SignupForm from './SignupForm'; // Import SignupForm
import Popup from './Popup'; // Import Popup component

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    console.log('Landing page loaded');
  }, []);

  const toggleLoginPopup = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleSignupPopup = () => {
    setIsSignupOpen(!isSignupOpen);
  };

  return (
    <div className="landing-page">
      <LandingNavbar onLoginClick={toggleLoginPopup} onSignupClick={toggleSignupPopup} />
      <div className="content">
        <div className="text">
          <h1>
            <span style={{ color: "skyblue" }}>Opti</span>mize your work
            <span style={{ color: "skyblue" }}>flow</span> with <br />
            <strong style={{ fontSize: "80px", color: "#00bfff" }}>OptiFlow</strong>
          </h1>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            The best platform for project management, task organization, and team collaboration.
          </p>
          <div className="typewriter-wrapper">
            <Typewriter
              options={{
                strings: [
                  "Project Management",
                  "Team Collaboration",
                  "Employee Recommendation",
                ],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </div>
          <div className="cta">
            <button className="cta-button" onClick={toggleLoginPopup}>Login</button>
            <button className="cta-button" onClick={toggleSignupPopup}>Sign Up</button>
          </div>
        </div>

        <div className="image">
          <img src={Image} alt="Workflow optimization" />
        </div>
      </div>

      {/* Popup Modals */}
      <Popup isOpen={isLoginOpen} onClose={toggleLoginPopup}>
        <LoginForm />
      </Popup>

      <Popup isOpen={isSignupOpen} onClose={toggleSignupPopup}>
        <SignupForm />
      </Popup>
    </div>
  );
};

export default LandingPage;