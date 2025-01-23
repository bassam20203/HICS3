import './App.css';
import Footer from './Commponant/Footer';
import Header from './Commponant/header';
import Resalt from './code/Resalt';
import Xlec from './code/Xlec';
import HomePage from './code/HomePage';
import EditPage from './code/EditPage';
import EditFilePagee from './code/EditFilePagee';
import AdminLogin from './code/AdminLogin';

import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate();
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="content">
        <Routes basename="/HICS3">
          <Route path="/" element={<Resalt />} />
          <Route path="/upload" element={isLoggedIn ? <Xlec /> : <Navigate to="/admin-login" state={{ from: location }} />} />
          <Route path="/homejson" element={isLoggedIn ? <HomePage /> : <Navigate to="/admin-login" state={{ from: location }} />} />
          <Route
            path="/edit-file/:stage?"
            element={
              isLoggedIn ? (
                <EditFilePagee />
              ) : (
                <Navigate to="/admin-login" state={{ from: location }} />
              )
            }
          />          <Route path="/edit/:stage" element={isLoggedIn ? <EditPage /> : <Navigate to="/admin-login" state={{ from: location }} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
