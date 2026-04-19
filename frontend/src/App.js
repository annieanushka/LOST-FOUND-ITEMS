import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import AddItem from './components/AddItem';
import MyPosts from './components/MyPosts';
import './App.css';
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
}
function App() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
        />
        <Route
          path="/login"
          element={(
            <PublicRoute>
              <Login />
            </PublicRoute>
          )}
        />
        <Route
          path="/register"
          element={(
            <PublicRoute>
              <Register />
            </PublicRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/add-item"
          element={(
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/my-posts"
          element={(
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </Router>
  );
}
export default App;
