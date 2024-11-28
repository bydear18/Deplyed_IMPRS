import './adminlogin.css';
import React, { useState, useEffect } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [alert, setAlert] = useState('hide');
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === 'true') {
        navigate('/admin');
      }
    };
    
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const infoPop = (message) => {
    setAlert('show');
    setAlertMsg(message);
  };

  const closeInfoPop = () => {
    setAlert('hide');
  };

  const handleLogin = () => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`http://localhost:8080/services/userLogin?email=${email}&password=${password}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data['message'] === 'Admin login') {
          localStorage.setItem("email", email);
          localStorage.setItem("isLoggedIn", true);
          navigate('/admin');
        } else {
          setLoggedIn(false);
          infoPop('There is no admin account that matches those credentials.');
        }
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUserLogin = () => {
    navigate('/');
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <div className='main section'>
      <div id="infoPopOverlay" className={alert}></div>
      <div id="infoPop" className={alert}>
        <p>{alertMsg}</p>
        <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
      </div>
      <div className='title'>
        <h1>INSTRUCTIONAL MATERIAL PRINTING REQUEST</h1>
      </div>
      <div className='alogin-container'>
        <h2>Admin Authentication</h2>
        {isLoggedIn ? (
          <p>You are logged in!</p>
        ) : (
          <form id="loginForm">
            <label>
              <FaUser />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </label>
            <label>
              <FaLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </label>
            <div className="buttons">
              <button className='login-btn' type="button" onClick={handleLogin}>
                Login
              </button>
              <button className='clear-btn' type="button" onClick={handleClear}>
                Clear Entities
              </button>
            </div>
          </form>
        )}
      </div>
      <div className='cit-bglogo'></div>
      <button id='adminLogin' onClick={handleUserLogin}>Login as User</button>
    </div>
  );
};

export default LoginAdmin;
