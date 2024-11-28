import './Account.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { FaUser } from 'react-icons/fa';
import { HiAtSymbol } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

import Miming from './Miming.svg';

const Account = () => {
    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');

    const infoPop =(message) => {
        setAlert('show');
        setAlertMsg(message);
    }

    const closeInfoPop = () => {
      setAlert('hide');
    }

    const navigate = useNavigate();
    const [show, setShow] = useState('hide');
    const [toConfirm, setToConfirm] = useState('hide');
    const [changed, setChanged] = useState(false);
    const [infoStep, setInfoStep] = useState(0);
    const [disabled, setDisabled] = useState(true);
    const [firstName, setFirstName] = useState(localStorage.getItem("firstName"));
    const [lastName, setLastName] = useState(localStorage.getItem("lastName"));
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [schoolID, setSchoolID] = useState(localStorage.getItem("schoolId"));
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [infoText, setInfoText] = useState('Change Information');

    useEffect(() => {
        setFirstName(localStorage.getItem("firstName"));
        setLastName(localStorage.getItem("lastName"));
        setEmail(localStorage.getItem("email"));
        setSchoolID(localStorage.getItem("schoolId"));
    }, []);
    
    const handleLogOut = () => {   
        localStorage.setItem("firstName", '');     
        localStorage.setItem("lastName", '');
        localStorage.setItem("email", '');
        localStorage.setItem("schoolId", '');
        localStorage.setItem("isLoggedIn", '');
        navigate("/");
    }

    const handleChangeInfo = () => {
        if(infoStep===0){
            setDisabled(false);
            setInfoText('Okay');
            setInfoStep(1);
        }else if(infoStep===1 && changed!==true){
            setDisabled(true);
            setInfoText('Change Information');
            setInfoStep(0);
        }else if(infoStep===1 && changed===true){
            setInfoStep(2);
            setToConfirm('hide');
            setShow('show');
        }
    }
    
    const passwordPrompt = () => {
        setInfoStep(3);
        setToConfirm('show');
        setShow('show');
    }

    const handleProceed = () => {
        if(infoStep===2){
            const requestOptions = {
                method: 'GET',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
              },
              };
            const requestOptions2 = {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
              },
              };
    
            fetch("http://localhost:8080/services/checkAuth?email=" + localStorage.getItem("email") + "&password=" + password, requestOptions).then((response)=> response.json()
            ).then((data) => {
                if(data===true){
                    if(email!==localStorage.getItem("email")){
                        fetch("http://localhost:8080/services/newEmail?newEmail=" + email + "&email=" + localStorage.getItem("email"), requestOptions2).then((response)=> response.json()
                        ).then((data) => {
                            localStorage.setItem("email", email);
                            setInfoStep(0);
                            setToConfirm('hide');
                            setShow('hide');
                            setDisabled(true);
                            setInfoText('Change Information');
                            window.location.reload();
                        })
                        .catch(error =>
                            {
                                console.log(error);
                            }
                        );
                    }

                    if(firstName!==localStorage.getItem("firstName") || lastName!==localStorage.getItem("lastName")){
                        fetch("http://localhost:8080/services/newName?firstName=" + firstName + "&lastName=" + lastName + "&email=" + email, requestOptions2).then((response)=> response.json()
                        ).then((data) => {
                            setInfoStep(0);
                            setToConfirm('hide');
                            setShow('hide');
                            setDisabled(true);
                            setInfoText('Change Information');
                            localStorage.setItem("firstName", firstName);     
                            localStorage.setItem("lastName", lastName);
                            window.location.reload();
                        })
                        .catch(error =>
                            {
                                console.log(error);
                            }
                        );
                    }
                }
            })
            .catch(error =>
                {
                    console.log(error);
                }
            );
        }else if(infoStep===3){
            if(confirmPass===newPassword){
                const requestOptions = {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json',
                  },
                  };
                const requestOptions2 = {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json',
                  },
                  };
                fetch("http://localhost:8080/services/checkAuth?email=" + localStorage.getItem("email") + "&password=" + password, requestOptions).then((response)=> response.json()
                ).then((data) => {
                    console.log(data);
                    if(data===true){
                            fetch("http://localhost:8080/services/newPassword?email=" + localStorage.getItem("email") + "&password=" + password, requestOptions2).then((response)=> response.json()
                            ).then((data) => {
                                setInfoStep(0);
                                setDisabled(true);
                                setToConfirm('hide');
                                setShow('hide');
                                window.location.reload();
                            })
                            .catch(error =>
                                {
                                    console.log(error);
                                }
                            );
                    }
                })
                .catch(error =>
                    {
                        console.log(error);
                    }
                );
            }else{
                infoPop('Please make sure your passwords match!');
            }
        }else{
        }
    }

    const closeModal = () => {
        setShow('hide');
        setPassword('');
        setNewPassword('');
        setConfirmPass('');
        setInfoStep(0);
    }

    return (
        <div id='accWhole'>
            <div id="infoPopOverlay" className ={alert}></div>
            <div id="infoPop" className={alert}>
                <p>{alertMsg}</p>
                <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
            </div>
            <div id='accCont'>
            <button id='updoot' onClick={handleChangeInfo}>{infoText}</button>
            <button id='dent' onClick={passwordPrompt}>Change Password</button>
            <button id='dant' onClick={handleLogOut}>Log Out</button>
                <div id='accDivider'> </div>
                    <img src={Miming}  id='accIcon'/>
                    <div className='accName'>{lastName}, {firstName}</div>
                    <div className='accType'>Head</div>
                    <div id='inputContainer'>
                        <p className='inLab uwahiNgan'>Last Name</p>
                    <FaUser className='accIcon userIcon' />
                        <input type='text' value={lastName} className='LastA AccInput topTwo' onChange={(e)=>{setLastName(e.target.value); setChanged(true)}} disabled={disabled}/>
                        <p className='inLab unaNgan'>First Name</p>
                        <input type='text' value={firstName} className='AccInput topTwo' onChange={(e)=>{setFirstName(e.target.value); setChanged(true)}} disabled={disabled}/>
                        <p className='inLab bottomL'>Email Address</p>
                    <HiAtSymbol id='accEms' className='accIcon'/>
                        <input type='email' value={email} className='FirstA AccInput' onChange={(e)=>{setEmail(e.target.value); setChanged(true)}} disabled={disabled}/>
                    </div>
                    <div id='accountID'>SCHOOL ID: <p id='accountNumber'>{schoolID}</p> </div>

            </div>
                <div id="overlay" className = {show} onClick={closeModal}></div>
                    <div id="changeInformation" className ={show}>
                        <h1>Confirm</h1>
                        <p>Please input password to continue</p>
                        <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password"/>
                        <input type="password" className={toConfirm} value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} placeholder="New Password"/>
                        <input type="password" className={toConfirm} value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}} placeholder="Confirm New Password"/>
                        <button id='infoChangeBtn' onClick={handleProceed}>Proceed</button>
                    </div>
            </div>
    );
}

export default Account;
