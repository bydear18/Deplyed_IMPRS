import './staffbody.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import Account from './AccountTab/Account';
import Hometab from './HomeTab/HomeTab';
import Wildcat from './Wildcat.png';
import Dashboard from './Dashboard/Dashboard';
import RequestHistory from './RequestHistory/History';
import SystemReport from './Reports/Reports';
function HomeBody () {
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem("isLoggedIn")!=="true"){
            navigate("/");
        }
    });

    const [toggleState, setToggleState] = useState(1);

        const toggleTab = (index) => {
            setToggleState(index);
        }

    return (

    <div id="whole">
        <div id='layer'>
            <div id="container">
                <div className={toggleState === 1 ? "tab active-tab" : "tab"} onClick={() => toggleTab(1)}>Home</div>
                <div className={toggleState === 2 ? "tab active-tab" : "tab"} onClick={() => toggleTab(2)}>Dashboard</div>
                <div className={toggleState === 3 ? "tab active-tab" : "tab"} onClick={() => toggleTab(3)}>Summary of Requests</div>
                <div className={toggleState === 4 ? "tab active-tab" : "tab"} onClick={() => toggleTab(4)}>System Report</div>
            </div>


            <div className={toggleState === 1 ? "content active-content" : "content"} onClick={() => toggleTab(1)}>
                <Hometab/>
            </div>
            <div className={toggleState === 2 ? "content active-content" : "content"} onClick={() => toggleTab(2)}>
                <Dashboard/>
            </div>
            <div className={toggleState === 3 ? "content active-content" : "content"} onClick={() => toggleTab(3)}>
                <RequestHistory/>
            </div>

            <div className={toggleState === 4 ? "content active-content" : "content"} onClick={() => toggleTab(4)}>
                <SystemReport/>
            </div>


            <img src={Wildcat}/>
        </div>
    </div>
        )
    };

export default HomeBody;
