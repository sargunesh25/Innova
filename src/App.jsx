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
import LoggedInNavbar from './components/LoggedInNavbar';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isChallengeDetails = location.pathname.startsWith('/challenge/');
  const isSubmitIdea = location.pathname === '/submit';
  const isAuthPage = location.pathname === '/join' || location.pathname === '/login';
  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname === '/profile';

  return (
    <div className={`app-container ${isAuthPage ? 'auth-layout' : ''}`}>
      {isAuthPage ? <AuthNavbar /> : (isDashboard || isProfile) ? <LoggedInNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenge/:id" element={<ChallengeDetails />} />
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {isAuthPage ? <AuthFooter /> : (isSubmitIdea || isDashboard || isProfile) ? <SubmitFooter /> : isChallengeDetails ? <SimpleFooter /> : <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
