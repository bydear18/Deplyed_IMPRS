import './AdminAccount.css';

import {
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { HiAtSymbol } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

import Miming from './Miming.svg';

const AdminAccount = () => {
    const navigate = useNavigate()

    const handleLogOut = () => {   
        localStorage.setItem("firstName", '');     
        localStorage.setItem("lastName", '');
        localStorage.setItem("email", '');
        localStorage.setItem("userID", '');
        localStorage.setItem("isLoggedIn", '');
        navigate("/");
    };

    return (
        <div id='accWhole'>
            <div id='accCont'>
            <button id='updoot'>Update Information</button>
            <button id='dent'>Change Password</button>
            <button id='dant' onClick={handleLogOut}>Log Out</button>
                <div id='accDivider'> </div>
                <img src={Miming}  id='accIcon'/>
                    <div className='accName'>Canton, Pancit</div>
                    <div className='accType'>User</div>
                    <div id='inputContainer'>
                        <p className='inLab uwahiNgan'>Last Name</p>
                    <FaUser className='accIcon userIcon' />
                        <input type='text' value='Canton' className='LastA AccInput topTwo' disabled='true'/>
                        <p className='inLab unaNgan'>First Name</p>
                        <input type='text' value='Pancit' className='AccInput topTwo' disabled='true'/>
                        <p className='inLab bottomL'>Email Address</p>
                    <HiAtSymbol id='accEms' className='accIcon'/>
                        <input type='email' value='katolakongitlog@gmail.com' className='FirstA AccInput' disabled='true'/>
                        <p className='inLab bottomL'>Password</p>
                    <FaLock className='accIcon passIcon'/>
                        <input type='password' value='Nakaigit Ko' className='AccInput' disabled='true'/>
                    </div>
            </div>

           
        </div>
    )
}

export default AdminAccount;