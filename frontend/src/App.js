import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages & Components
import Home from './pages/Home.js';
import LandingPage from './pages/LandingPage.js';  // Import LandingPage
import SignupForm from './pages/SignupForm.js';
import LoginForm from './pages/LoginForm.js';
import MyForm from "./pages/Form.js";
import ForgotForm from './pages/ForgotPassword.js';
import AdminSignupForm from './pages/SignupAdmin.js';
import AdminLoginForm from './pages/AdminLogin.js';
import ProfileUpdate from './pages/UpdateProfile.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Logout from './pages/Logout.js';
import Profile from './pages/Profile.js';
import ResumeRankingForm from './pages/ResumeRankingForm.js';
import Task from './pages/AddTask.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            {/* Public route for the Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Protected route for the Home page */}
            <Route 
              path="/home" 
              element={<ProtectedRoute><Home /></ProtectedRoute>} 
            />

            {/* Public routes */}
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/sendEmail" element={<MyForm />} />
            <Route path="/forgot_password" element={<ForgotForm />} />

            {/* Resume review route (only accessible by admin) */}
            <Route 
              path="/resume_review" 
              element={<ProtectedRoute adminOnly={true}><ResumeRankingForm /></ProtectedRoute>} 
            />

            {/* Admin-only protected routes */}
            <Route 
              path="/signup_admin" 
              element={<ProtectedRoute adminOnly={true}><AdminSignupForm /></ProtectedRoute>} 
            />
            <Route 
              path="/login_admin" 
              element={<AdminLoginForm />} 
            />
            <Route 
              path="/update_profile" 
              element={<ProfileUpdate />} 
            />
            <Route 
              path="/logout" 
              element={<Logout />} 
            />
            <Route 
              path="/profile" 
              element={<Profile />} 
            />
            <Route 
              path="/create_task" 
              element={<ProtectedRoute adminOnly={true}><Task /></ProtectedRoute>} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
