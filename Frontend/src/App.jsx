import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddListing from './pages/AddListing';
import AdminPortal from './pages/AdminPortal';
import LeaderDashboard from './pages/LeaderDashboard';
import ChatSystem from './pages/ChatSystem';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import NotFound from './pages/NotFound';

// Route guard: must be logged in
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Route guard: must have specific role
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Redirect logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />

        {/* Auth Routes (redirect if already logged in) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Protected User Routes */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/sell" element={<PrivateRoute><AddListing /></PrivateRoute>} />
        <Route path="/inbox" element={<PrivateRoute><ChatSystem /></PrivateRoute>} />
        <Route path="/chat" element={<Navigate to="/inbox" replace />} />

        {/* Role-Protected Routes */}
        <Route
          path="/leader/*"
          element={
            <RoleRoute allowedRoles={['LEADER']}>
              <LeaderDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminPortal />
            </RoleRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
