import { useState } from '@lynx-js/react';
import { Login } from './components/Login.js';
import { Register } from './components/Register.js';
import { Dashboard } from './components/Dashboard.js';
import './App.css';

export function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>('login');

  return (
    <view className="MainAppContainer">
      {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <Register onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
    </view>
  );
}
