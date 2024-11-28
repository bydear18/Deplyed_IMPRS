import './Navbar.css';
import { useEffect, useState } from 'react';
import { HiBell, HiUser, HiAtSymbol } from 'react-icons/hi';
import Popup from 'reactjs-popup';
import { FaUser } from 'react-icons/fa';
import Miming from './Miming.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState('hide');
    const [values, setValues] = useState([]);
    const [notifShow, setNotifShow] = useState('hide');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({
        firstName: localStorage.getItem("firstName") || '',
        lastName: localStorage.getItem("lastName") || '',
        email: localStorage.getItem("email") || '',
        schoolId: localStorage.getItem("schoolId") || ''
    });
    const [alertMsg, setAlertMsg] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [show, setShow] = useState('hide');
    const [toConfirm, setToConfirm] = useState('hide');
    const [changed, setChanged] = useState(false);
    const [infoStep, setInfoStep] = useState(0);
    const [disabled, setDisabled] = useState(true);
    const [firstName, setFirstName] = useState(localStorage.getItem("firstName"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [lastName, setLastName] = useState(localStorage.getItem("lastName"));
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [schoolId, setSchoolId] = useState(localStorage.getItem("schoolId"));
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [infoText, setInfoText] = useState('Change Information');
    const infoPop =(message) => {
        setAlert('show');
        setAlertMsg(message);
    }

    const closeInfoPop = () => {
      setAlert('hide');
    }


    useEffect(() => {
        const userID = localStorage.getItem("userID");
        const email = localStorage.getItem("email");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (isLoggedIn) {
            fetch(`https://backimps-production.up.railway.app/services/checkAdmin?email=${email}`, { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/json' } })
                .then(response => response.json())
                .then(() => {
                    setNotifShow('show');
                    return fetch(`https://backimps-production.up.railway.app/notifications/id?id=${userID}`, { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/json' } });
                })
                .then(response => response.json())
                .then(data => setValues(data))
                .catch(console.error);
        } else {
            setNotifShow('hide');
        }
    }, []);

    // Modal management
    const handleUserIconClick = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
      };
    

    // Alert management
    const showAlertMessage = (message) => {
        setAlertMsg(message);
        setShowAlert(true);
    };
    const closeAlert = () => setShowAlert(false);

    // Log out function
    const handleLogOut = () => {
        localStorage.clear();
        navigate("/");
    };

    // Info change handling
    const handleChangeInfo = () => {
        if (infoStep === 0) {
            setDisabled(false);
            setInfoText('Okay');
            setInfoStep(1);
        } else if (infoStep === 1) {
            setDisabled(!userInfo.firstName && !userInfo.lastName && !userInfo.email);
            if (disabled) {
                setInfoStep(0);
                setInfoText('Update Information');
            } else {
                setInfoStep(2);
                showAlertMessage('Please confirm your changes.');
            }
        }
    };
    const passwordPrompt = () => {
        setInfoStep(3);
        setToConfirm('show');
        setShow('show');
    }
    const handleProceed = () => {
        if (infoStep === 2) {
            // Logic for handling info changes
            const requestOptions = {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }
            };

            // Update user info only if changed
            if (userInfo.email !== localStorage.getItem("email")) {
                fetch(`https://backimps-production.up.railway.app/services/newEmail?newEmail=${userInfo.email}&email=${localStorage.getItem("email")}`, requestOptions)
                    .then(() => {
                        localStorage.setItem("email", userInfo.email);
                        setInfoStep(0);
                        closeModal();
                        window.location.reload();
                    })
                    .catch(console.error);
            }
            if (userInfo.firstName !== localStorage.getItem("firstName") || userInfo.lastName !== localStorage.getItem("lastName")) {
                fetch(`https://backimps-production.up.railway.app/services/newName?firstName=${userInfo.firstName}&lastName=${userInfo.lastName}&email=${userInfo.email}`, requestOptions)
                    .then(() => {
                        localStorage.setItem("firstName", userInfo.firstName);
                        localStorage.setItem("lastName", userInfo.lastName);
                        setInfoStep(0);
                        closeModal();
                        window.location.reload();
                    })
                    .catch(console.error);
            }
        } else if (infoStep === 3) {
            if (confirmPass === newPassword) {
                // Change password logic
                const requestOptions = {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' }
                };
                fetch(`https://backimps-production.up.railway.app/services/newPassword?email=${localStorage.getItem("email")}&password=${newPassword}`, requestOptions)
                    .then(() => {
                        setInfoStep(0);
                        closeModal();
                        window.location.reload();
                    })
                    .catch(console.error);
            } else {
                showAlertMessage('Please ensure your passwords match!');
            }
        }
    };

    return (
        <div className='navBar flex'>
            
            {isModalOpen && (
                <div id='modalOverlay'>
                    <div id='accWhole'  style={{marginTop: '-2vw'}}>
                        <div id="infoPopOverlay" className={alert}></div>
                        <div id="infoPop" className={alert}>
                            <p>{alertMsg}</p>
                            <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
                        </div>
                        <div id='accCont'>
                            <button id='closeBtn' onClick={closeModal}>Close</button>
                            <button id='dent' onClick={passwordPrompt}>Change Password</button>
                            <button id='dant' onClick={handleLogOut}>Log Out</button>
                            <div id='accDivider'></div>
                            <img src={Miming} id='accIcon' />
                            <div className='accName'>{lastName}, {firstName}</div>
                            <div className='accType'>{role}</div>
                            <div id='inputContainer'>
                                <p className='inLab uwahiNgan'>Last Name</p>
                                <FaUser className='accIcon userIcon' />
                                <input type='text' value={lastName} className='LastA AccInput topTwo' onChange={(e) => { setLastName(e.target.value); setChanged(true) }} disabled={disabled} />
                                <p className='inLab unaNgan'>First Name</p>
                                <input type='text' value={firstName} className='AccInput topTwo' onChange={(e) => { setFirstName(e.target.value); setChanged(true) }} disabled={disabled} />
                                <p className='inLab bottomL'>Email Address</p>
                                <HiAtSymbol id='accEms' className='accIcon' />
                                <input type='email' value={email} className='FirstA AccInput' onChange={(e) => { setEmail(e.target.value); setChanged(true) }} disabled={disabled} />
                            </div>
                            <div id='accountID'>SCHOOL ID: <p id='accountNumber'>{schoolId}</p></div>
                        </div>
                        <div id="overlay" className={show} onClick={closeModal}></div>
                        <div id="changeInformation" className={show}>
                            <h1>Confirm</h1>
                            <p>Please input password to continue</p>
                            <input type="password" onChange={(e) => { setPassword(e.target.value) }} />
                            <div id='btnContainer'>
                                <button className='proceed' onClick={handleProceed}>Proceed</button>
                                <button className='cancel' onClick={() => { setToConfirm('hide'); setShow('hide'); }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="navBarOne flex">
                <div className='citlogo'></div>
                <div className="iconContainer flex">
                    <Popup trigger={<button id='notifbutt' className={notifShow}><HiBell id='notifIcon' /></button>} position="left top">
                        <div id='panel' scrollable="true">
                            <div id='notifHead'>NOTIFICATIONS</div>
                            {values.map((notif, idx) => (
                                <div key={idx}>
                                    <hr />
                                    <h1 id='notID'>{notif.requestID}</h1>
                                    <p className='notContent notifMain'>{notif.header}</p>
                                    <p className='notContent notifDate'>{notif.content}</p>
                                    <p>{notif.createdDate}</p>
                                </div>
                            ))}
                        </div>
                    </Popup>
                    <button id='userButt' onClick={handleUserIconClick}>
                        <HiUser  id='userIcon'/>
                        </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;