import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
export function App() {
  return <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout>
                    <Dashboard />
                  </Layout>} />
              <Route path="/settings" element={<Layout>
                    <Settings />
                  </Layout>} />
              <Route path="/categories" element={<Layout>
                    <Categories />
                  </Layout>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>;
}