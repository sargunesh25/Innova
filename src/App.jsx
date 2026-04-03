import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubmitFooter from './components/SubmitFooter';
import AuthNavbar from './components/AuthNavbar';
import AuthFooter from './components/AuthFooter';
import SimpleFooter from './components/SimpleFooter';
import LoggedInNavbar from './components/LoggedInNavbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import './App.css';

// Lazy-loaded page components for code-splitting
const Home = lazy(() => import('./pages/Home'));
const Challenges = lazy(() => import('./pages/Challenges'));
const SubmitIdea = lazy(() => import('./pages/SubmitIdea'));
const ChallengeDetails = lazy(() => import('./pages/ChallengeDetails'));
const Join = lazy(() => import('./pages/Join'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Laboratory = lazy(() => import('./pages/Laboratory'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));

const PageLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #e0e0e0', borderTopColor: 'var(--brand-green, #1a6d36)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
      {isAuthPage ? <AuthFooter /> : (isSubmitIdea || isDashboardLayout) ? <SubmitFooter /> : isChallengeDetails ? <SimpleFooter /> : <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <AppContent />
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
