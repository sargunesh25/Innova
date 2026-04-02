import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubmitFooter from './components/SubmitFooter';
import AuthNavbar from './components/AuthNavbar';
import AuthFooter from './components/AuthFooter';
import SimpleFooter from './components/SimpleFooter';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import SubmitIdea from './pages/SubmitIdea';
import ChallengeDetails from './pages/ChallengeDetails';
import Join from './pages/Join';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Laboratory from './pages/Laboratory';
import CompanyDashboard from './pages/CompanyDashboard';
import LoggedInNavbar from './components/LoggedInNavbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, userRole } = useAuth();
  const isChallengeDetails = location.pathname.startsWith('/challenge/');
  const isSubmitIdea = location.pathname === '/submit';
  const isAuthPage = location.pathname === '/join' || location.pathname === '/login';
  const isDashboardLayout = location.pathname === '/dashboard' || location.pathname === '/laboratory' || location.pathname === '/profile';

  return (
    <div className={`app-container ${isAuthPage ? 'auth-layout' : ''}`}>
      {isAuthPage ? <AuthNavbar /> : isAuthenticated ? <LoggedInNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenge/:id" element={<ChallengeDetails />} />
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={userRole === 'company' ? <CompanyDashboard /> : <Dashboard />} />
        <Route path="/laboratory" element={<Laboratory />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {isAuthPage ? <AuthFooter /> : (isSubmitIdea || isDashboardLayout) ? <SubmitFooter /> : isChallengeDetails ? <SimpleFooter /> : <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
