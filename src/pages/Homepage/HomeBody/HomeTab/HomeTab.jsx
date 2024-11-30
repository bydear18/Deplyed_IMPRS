import './hometab.css';
import React, { useEffect, useState } from 'react';

const Hometab = () => {
    const [tab1, setTab1] = useState('');
    const [tab2, setTab2] = useState('');
    const [tab3, setTab3] = useState('');
    const [tab4, setTab4] = useState('');
    const [tab5, setTab5] = useState('');
    const [toggleState, setToggleState] = useState(1);
    const [headerName, setHeaderName] = useState('Listen Here!');
    const [adminEdit, setAdminEdit] = useState('hide');
    const [blocked, setBlocked] = useState(true);
    const [buttonText, setButtonText] = useState('Edit');
    const [editing, setEditing] = useState(false);

    const changeHeader = (header) => {
        setHeaderName(header);
    };

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const handleEdit = () => {
        const requestOptions = {
            method: 'PUT', // Use PUT for updating data
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ann: tab1,
                guide: tab2,
                loc: tab4,
                pro: tab3,
                upd: tab5,
            }),
        };

        if (!editing) {
            // Start editing mode
            setEditing(true);
            setBlocked(false);
            setButtonText('Save');
        } else {
            // End editing mode and send the data
            fetch("http://localhost:8080/services/updateHomeDetails", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setEditing(false);
                    setBlocked(true);
                    setButtonText('Edit');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        // Check if the user is an admin
        fetch(`http://localhost:8080/services/checkAdmin?email=${localStorage.getItem("email")}`, requestOptions)
            .then((response) => response.text())  // Fetch response as text
            .then((data) => {
                console.log('Check Admin Response:', data);  // Log raw response for debugging
                try {
                    if (data.trim() === '') {
                        console.error('Received empty response for admin status');
                        return;
                    }
                    const parsedData = JSON.parse(data);  // Attempt to parse the data
                    setAdminEdit(parsedData ? 'show' : 'hide');
                } catch (e) {
                    console.error("Failed to parse JSON for admin status:", e);
                }
            })
            .catch((error) => {
                console.error('Error fetching admin status:', error);
            });
    
        // Fetch home data if not editing
        if (!editing) {
            fetch("http://localhost:8080/services/getHomeDetails", requestOptions)
                .then((response) => response.text())  // Read response as text
                .then((data) => {
                    console.log('Home Data Response:', data);  // Log the raw response
                    try {
                        if (data.trim() === '') {
                            console.error('Received empty response for home data');
                            return;
                        }
                        const parsedData = JSON.parse(data);  // Attempt to parse the data
                        setTab1(parsedData.announcements.replace(/\\n/g, '\n'));
                        setTab2(parsedData.guidelines.replace(/\\n/g, '\n'));
                        setTab3(parsedData.process.replace(/\\n/g, '\n'));
                        setTab4(parsedData.locations.replace(/\\n/g, '\n'));
                        setTab5(parsedData.updates.replace(/\\n/g, '\n'));
                    } catch (e) {
                        console.error("Failed to parse JSON for home details:", e);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching home details:', error);
                });
        }
    }, [editing]);
    

    return (
        <div id='homeBox'>
            <div id='tabCont'>
                <div className={toggleState === 1 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(1); changeHeader('Listen Here!') }}>Announcements</div>
                <div className={toggleState === 2 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(2); changeHeader('Guidelines') }}>Guidelines</div>
                <div className={toggleState === 3 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(3); changeHeader('Claiming Process') }}>Claiming Process</div>
                <div className={toggleState === 4 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(4); changeHeader('Where to Claim?') }}>Locations</div>
                <div className={toggleState === 5 ? "Htab Hactive-tab" : "Htab"} onClick={() => { toggleTab(5); changeHeader("What's New?") }}>Updates</div>
            </div>

            <div className="Hcontentpos">
                <div id="adminHomeHeader">
                    <h1>{headerName}</h1>
                    <button id="adminEdit" className={adminEdit} onClick={handleEdit}>{buttonText}</button>
                </div>
                <hr />
                <div className={toggleState === 1 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab1}
                        disabled={blocked}
                        onChange={(e) => { setTab1(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 2 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab2}
                        disabled={blocked}
                        onChange={(e) => { setTab2(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 3 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab3}
                        disabled={blocked}
                        onChange={(e) => { setTab3(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 4 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab4}
                        disabled={blocked}
                        onChange={(e) => { setTab4(e.target.value); }}
                        className='homeText'
                    />
                </div>

                <div className={toggleState === 5 ? "active-Hcontent" : "Hcontent"}>
                    <textarea
                        value={tab5}
                        disabled={blocked}
                        onChange={(e) => { setTab5(e.target.value); }}
                        className='homeText'
                    />
                </div>
            </div>
        </div>
    );
};

export default Hometab;
