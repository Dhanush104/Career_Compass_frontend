import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Add components back step by step
import LandingPage from './components/LandingPage.jsx';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    toast.success('Successfully logged in!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('careerPaths');
    setUser(null);
    toast.success('Successfully logged out');
  };

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage onLoginClick={() => { /* Handled via link in Header now */ }} />
          </PublicRoute>
        } />

        <Route path="/login" element={
          <PublicRoute>
            <AuthForm type="login" onAuthSuccess={handleAuthSuccess} />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <AuthForm type="register" onAuthSuccess={handleAuthSuccess} />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard
              onLogout={handleLogout}
              user={user}
              onUserUpdate={(updatedUserData) => {
                setUser(updatedUserData);
                localStorage.setItem('user', JSON.stringify(updatedUserData));
              }}
            />
          </ProtectedRoute>
        } />

        {/* Placeholder Routes for Header Links to prevent 404s */}
        <Route path="/mentorship" element={<ProtectedRoute><div className="p-8">Mentorship Feature Coming Soon</div></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><div className="p-8">Courses Feature Coming Soon</div></ProtectedRoute>} />
        <Route path="/podcasts" element={<ProtectedRoute><div className="p-8">Podcasts Feature Coming Soon</div></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><div className="p-8">Placement Feature Coming Soon</div></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><div className="p-8">Profile Feature Coming Soon</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div className="p-8">Settings Feature Coming Soon</div></ProtectedRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;