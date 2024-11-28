import './homebody.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import Account from './AccountTab/Account';
import Hometab from './HomeTab/HomeTab';
import PrintReq from './PrintReqTab/PrintReqTab';
import Record from './RecordTab/RecordTab';
import Wildcat from './Wildcat.png';
import RequestFeedback from './RequestFeedback/Dashboard';

function HomeBody () {
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem("isLoggedIn")!=="true"){
            navigate("/");
        }
    },[navigate]);

    const [toggleState, setToggleState] = useState(1);

        const toggleTab = (index) => {
            setToggleState(index);
        }
    const navigateToFeedback = () => {
            setToggleState(2);
        };
    return (

    <div id="whole">
        <div id='layer'>
            <div id="container">
                <div className={toggleState === 1 ? "tab active-tab" : "tab"} onClick={() => toggleTab(1)}>Home</div>
                <div className={toggleState === 2 ? "tab active-tab" : "tab"} onClick={() => toggleTab(2)}>Print Request</div>
                <div className={toggleState === 3 ? "tab active-tab" : "tab"} onClick={() => toggleTab(3)}>Print Record</div>
                <div className={toggleState === 4 ? "tab active-tab" : "tab"} onClick={() => toggleTab(4)}>Request Feedback</div>
            </div>


            <div className={toggleState === 1 ? "content active-content" : "content"} onClick={() => toggleTab(1)}>
                <Hometab/>
            </div>


            <div className={toggleState === 2 ? "content active-content" : "content"} onClick={() => toggleTab(2)}>
            <PrintReq onRequestSubmitted={navigateToFeedback}/>
            </div>

            <div className={toggleState === 3 ? "content active-content" : "content"} onClick={() => toggleTab(3)}>
                <Record/>
            </div>
        
            <div className={toggleState === 4 ? "content active-content" : "content"} onClick={() => toggleTab(4)}>
                <RequestFeedback/>
            </div>

            <img src={Wildcat}/>
        </div>
    </div>
        )
    };

export default HomeBody;