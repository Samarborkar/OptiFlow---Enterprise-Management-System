import { useState } from 'react';
import { sendEmail } from '../components/emailLogic'; // Importing the logic
import '../index.css'; // Importing the CSS

const MyForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    try {
      await sendEmail(email); // Call sendEmail function from emailLogic.js
      setSuccessMessage('OTP sent successfully!');
      setEmail(''); // Clear the email input after sending
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  return (
    <div className="otp-form">
      <form onSubmit={handleSendEmail}>
        <div className="otp-heading">
          <h4>Send OTP to Account</h4>
        </div>

        <div className="otp-container">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="otp-input"
            placeholder="Receiver's Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error">{error}</p>} {/* Error message */}
          {successMessage && <p className="success">{successMessage}</p>} {/* Success message */}

          <button type="submit" className="otp-button">
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyForm;
