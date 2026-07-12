import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import CreateStudy from './pages/CreateStudy';
import StudyDetails from './pages/StudyDetails';
import ChatReply from './pages/ChatReply';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reply/:token" element={<ChatReply />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/create-study" element={
            <PrivateRoute>
              <CreateStudy />
            </PrivateRoute>
          } />
          <Route path="/study/:id" element={
            <PrivateRoute>
              <StudyDetails />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
