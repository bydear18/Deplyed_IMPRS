import './forgotpassword.css';

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const ForgotPassContent = () => {
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');

    const infoPop =(message) => {
        setAlert('show');
        setAlertMsg(message);
    }

    const closeInfoPop = () => {
      setAlert('hide');
    }
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const [container, setContainer] = useState('fp-container');
    const [show1, setShow1] = useState('active-step');
    const [show2, setShow2] = useState('inactive-step');
    const [show3, setShow3] = useState('inactive-step');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleCloseStep1 = () => navigate('/');
    const handleStep2 = () => {
      const requestOptions = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
        },
        };
            fetch("http://localhost:8080/services/CheckEmail"  + "?email=" + email, requestOptions).then((response)=> response.json()
            ).then((data) => {
              if(data === true){
                  const requestOptions2 = {
                      method: 'POST',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json',
                    },
                    };
                  fetch("http://localhost:8080/services/ForgotPasswordStep1"  + "?email=" + email, requestOptions2).then((response)=> response.json()
                  ).then((data) => {if(data===true){
                    setShow1('inactive-step'); setShow2('active-step');}
                  else{
                      infoPop('Failed to send password reset token to your email. Try again.');
                  }})
                  .catch(error =>
                    {
                        console.log(error);
                    }
                );
              }else{
                infoPop('That email is not registered. Please register.');
              }})
              .catch(error =>
                {
                    console.log(error);
                }
            );
      // setShow1('inactive-step'); setShow2('active-step');
    }

    const handleCloseStep2 = () => navigate('/');

    const handleStep3 = () => {
      const requestOptions = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
        },
        };
            fetch("http://localhost:8080/services/ForgotPasswordStep2"  + "?email=" + email + "&token=" + token, requestOptions).then((response)=> response.json()
            ).then((data) => {
              if(data === true){
                setContainer('fp-container2');
                setShow2('inactive-step'); setShow3('active-step');
              }else{
                infoPop("That doesn't seem to be the right token.");
              }})
              .catch(error =>
                {
                    console.log(error);
                }
            );
      // setContainer('fp-container2');
      // setShow2('inactive-step'); setShow3('active-step');
    }
    const handleCloseStep3 = () => navigate('/');

    const handleChangePassword = () => {
        if(confirmPass === password){
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
        },
        };
            fetch("http://localhost:8080/services/ForgotPasswordStep3"  + "?password=" + password + "&email=" + email + "&token=" + token, requestOptions).then((response)=> response.json()
            ).then((data) => {console.log(data);})
            .catch(error =>
              {
                  console.log(error);
              }
          );
            navigate('/');
            }else{
                infoPop("Please make sure that your passwords match!");
            }
    }

    const handleEmail = (event) => {
        const value = event.target.value;
        setEmail(value);
    };

    const handleToken = (event) => {
        const value = event.target.value;
        setToken(value);
    };

    const handlePassword = (event) => {
        const value = event.target.value;
        setPassword(value);
    };

    const handleConfirmPass = (event) => {
        const value = event.target.value;
        setConfirmPass(value);
    };



    return (
        <div class='main section'>
        <div id="infoPopOverlay" className ={alert}></div>
          <div id="infoPop" className={alert}>
          <p>{alertMsg}</p>
          <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
        </div>
     
        <div class={container}>
          <h2>Forgot Password</h2>
            <div id="step1" class = {show1}>
            <h5>Please enter the email address linked to your account.</h5>
                <label>Email: </label>
                <input type="email" onChange={handleEmail} value={email} />
  
              <div class="fp-buttons">
                  <button className='red-btn' type="button" onClick={handleCloseStep1}>
                  Cancel
                  </button>
                  <button className='yellow-btn' type="button" onClick={handleStep2}>
                  Continue
                  </button>
              </div>
            </div>{/*Step 1*/}
            <div id="step2" class={show2}>
            <h5>Please enter the token you received from your email.</h5>
                <label>Token: </label>
                <input type="text" onChange={handleToken} value={token} />
  
              <div class="fp-buttons">
                  <button className='red-btn' type="button" onClick={handleCloseStep2} >
                  Cancel
                  </button>
                  <button className='yellow-btn' type="button" onClick={handleStep3}>
                  Continue
                  </button>
              </div>
            </div>{/*Step 2*/}
            <div id="step3" class={show3}>
            <h5>Please enter a new password.</h5>
                <label>Password: </label>
                <input type="password" onChange={handlePassword} value={password} />
                <label>Confirm Password: </label>
                <input type="password" onChange={handleConfirmPass} value={confirmPass} />

              <div class="fp-buttons">
                  <button className='red-btn' type="button" onClick={handleCloseStep3}>
                  Cancel
                  </button>
                  <button className='yellow-btn' type="button" onClick={handleChangePassword}>
                  Finish
                  </button>
              </div>
            </div>{/*Step 3*/}
        </div>
        <div className='cit-bglogo'></div>
  
      </div>
      
    );
  };
  
  export default ForgotPassContent;