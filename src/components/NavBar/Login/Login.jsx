import React, {
  useEffect,
  useState,
} from 'react';

import {
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const navigate = useNavigate()

    const infoPop =(message) => {
        setAlert('show');
        setAlertMsg(message);
    }

    const closeInfoPop = () => {
      setAlert('hide');
    }

    const handleLogin = () => {
      localStorage.setItem("email", email);
      const requestOptions = {
          method: 'GET',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
      };
  
      fetch("https://backimps-production.up.railway.app/services/userLogin?email=" + email + "&password=" + password, requestOptions)
          .then((response) => response.json())
          .then((data) => {
              if (data.status === true) {
                  localStorage.setItem("email", email);
  
                  const isAdmin = data['role'] === 'admin';
                  const isHead = data['role'] === 'head';
                  const isStaff = data['role'] === 'staff';
  
                  localStorage.setItem("isAdmin", isAdmin);
                  localStorage.setItem("isHead", isHead);
                  localStorage.setItem("isStaff", isStaff);
  
                  fetch("https://backimps-production.up.railway.app/services/getname?email=" + email, requestOptions)
                      .then((response) => response.json())
                      .then((data) => {
                          localStorage.setItem("firstName", data['firstName']);
                          localStorage.setItem("lastName", data['lastName']);
                          localStorage.setItem("schoolId", data['schoolId']);
                          localStorage.setItem("role", data['role']);
                          localStorage.setItem("college", data['college']);
                          localStorage.setItem("accType", data['accType']);
                          
                          
                          fetch("https://backimps-production.up.railway.app/services/getid?email=" + email, requestOptions)
                          .then((response) => response.json())
                          .then((data) => {
                              localStorage.setItem("userID", data['userID']);
                            
                              if (data['adminVerified'] === false) {
                                  infoPop('Your account is not yet accepted by the admin');
                                  
                              } else {
                                localStorage.setItem("isLoggedIn", true);
                                if (data['role'] === 'admin') {
                                  navigate('/admin');
                                } else if (data['role'] === 'head') {
                                    navigate('/head');
                                } else if (data['role'] === 'staff') {
                                    navigate('/staff');
                                } else if (data['role'] === 'Faculty Employee' || data['role'] === 'Office Employee') {
                                    localStorage.setItem("department", data['department']);
                                    localStorage.setItem("schoolId", data['schoolId']);
                                    localStorage.setItem("college", data['college']);
                                    localStorage.setItem("office", data['office']);
                                    navigate('/home');
                                }
                              }
                          })
                          .catch(error => {
                              console.log(error);
                          });
                      
                      })
                      .catch(error => {
                          console.log(error);
                      });
              } else {
                  infoPop('There is no account that matches those credentials. Please register.');
              }
              console.log(data);
          })
          .catch(error => {
              console.log(error);
          });
  };
  
  
  const handleClear = () => {
    setEmail('');
    setPassword('');
  };
  
  const handleRegister = () => {
    navigate("/register");
  }


  useEffect(() => {
    if(localStorage.getItem("isLoggedIn")==="true"){
        navigate("/home");
    }
  });

    return (
    <div className='main section'>
      <div id="infoPopOverlay" className ={alert}></div>
      <div id="infoPop" className={alert}>
          <p>{alertMsg}</p>
          <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
        </div>
      <div className='title'>
        <h1 style={{color: '#8f271a'}}>INSTRUCTIONAL MATERIAL PRINTING REQUEST</h1>
      </div>
      <div className='login-container'>
        <h2 style={{color: '#8f271a', fontWeight: 'bold'}}>Login</h2>
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
                <button className='register-btn' type="button" onClick={handleRegister}>Register</button>

            </div>
            
            <div className='fpass'>
              <p>Forgot Password? <a href="/forgotpassword"> Click Here</a></p>
            </div>
          </form>
        )}
        
      </div>
      <div className='cit-bglogo'></div>
        
    </div>

    
    )
};

export default Login;