import { useState } from '@lynx-js/react';
import { Login } from './components/Login.js';
import { Register } from './components/Register.js';
import { Dashboard, BoxDetails } from './components/Dashboard.js';
import './App.css';

export function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard' | 'details'>('login');
  const [selectedBox, setSelectedBox] = useState<any>(null);

  const handleNavigate = (page: 'login' | 'register' | 'dashboard' | 'details', data?: any) => {
    if (page === 'details' && data) {
      setSelectedBox(data);
    }
    setCurrentPage(page);
  };

  return (
    <view className="MainAppContainer">
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'register' && <Register onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'details' && selectedBox && (
        <BoxDetails box={selectedBox} onBack={() => setCurrentPage('dashboard')} />
      )}
    </view>
  );
}
