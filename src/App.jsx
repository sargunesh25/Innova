import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const Home = lazy(() => import('./pages/Home'));
const Challenges = lazy(() => import('./pages/Challenges'));
const SubmitIdea = lazy(() => import('./pages/SubmitIdea'));
const ChallengeDetails = lazy(() => import('./pages/ChallengeDetails'));
const Join = lazy(() => import('./pages/Join'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const About = lazy(() => import('./pages/About'));
const Legal = lazy(() => import('./pages/Legal'));
const Laboratory = lazy(() => import('./pages/Laboratory'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Pricing = lazy(() => import('./pages/Pricing'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const Settings = lazy(() => import('./pages/Settings'));
const ChallengeEditor = lazy(() => import('./pages/ChallengeEditor'));
const ChallengeManage = lazy(() => import('./pages/ChallengeManage'));
const CompanyPublic = lazy(() => import('./pages/CompanyPublic'));
const IPARDetail = lazy(() => import('./pages/IPARDetail'));
const VerifyIPAR = lazy(() => import('./pages/VerifyIPAR'));

const PageLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <div style={{ width: 40, height: 40, border: '3px solid #e0e0e0', borderTopColor: 'var(--brand-green, #1a6d36)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, userRole, authLoading } = useAuth();

  const isChallengeDetails = location.pathname.startsWith('/challenge/');
  const isSubmitIdea = location.pathname === '/submit';
  const isAuthPage = location.pathname === '/join' || location.pathname === '/login';
  const isDashboardLayout =
    location.pathname === '/dashboard' ||
    location.pathname === '/laboratory' ||
    location.pathname === '/profile' ||
    location.pathname === '/notifications' ||
    location.pathname === '/settings';

  if (authLoading) return <PageLoader />;

  return (
    <div className={`app-container ${isAuthPage ? 'auth-layout' : ''}`}>
      {isAuthPage ? <AuthNavbar /> : isAuthenticated ? <LoggedInNavbar /> : <Navbar />}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge/:id" element={<ChallengeDetails />} />
          <Route path="/companies/:posterId" element={<CompanyPublic />} />
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route path="/profile/ipar/:iparId" element={<IPARDetail />} />
          <Route path="/verify/ipar/:iparId" element={<VerifyIPAR />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              {userRole === 'company' ? <CompanyDashboard /> : <Dashboard />}
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute><Onboarding /></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />
          <Route path="/laboratory" element={
            <ProtectedRoute><Laboratory /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/challenges/new" element={
            <ProtectedRoute><ChallengeEditor mode="create" /></ProtectedRoute>
          } />
          <Route path="/challenges/:id/edit" element={
            <ProtectedRoute><ChallengeEditor mode="edit" /></ProtectedRoute>
          } />
          <Route path="/challenges/:id/manage" element={
            <ProtectedRoute><ChallengeManage /></ProtectedRoute>
          } />
          <Route path="/submit" element={
            <ProtectedRoute><SubmitIdea /></ProtectedRoute>
          } />
        </Routes>
      </Suspense>

      {isAuthPage
        ? <AuthFooter />
        : (isSubmitIdea || isDashboardLayout)
          ? <SubmitFooter />
          : isChallengeDetails
            ? <SimpleFooter />
            : <Footer />
      }
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
