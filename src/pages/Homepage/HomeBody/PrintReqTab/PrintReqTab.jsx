import './printreq.css';

import React, { useState, useEffect } from 'react';
import storage from '../../../../firebase';

function PrintReq({ onRequestSubmitted }) {
    
    const copies = new RegExp(/^\d{1,4}$/);

    const [alert, setAlert] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const infoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
    };

    const closeInfoPop = () => {
        setAlert('hide');
        if (success) {
            window.location.reload();
        }
    };
    const [isAdmin, setIsAdmin] = useState(false);
    const [isHead, setIsHead] = useState(true);
    const [isStaff, setIsStaff] = useState(false);
    const [buttonSubmit, setButtonSubmit] = useState(false);
    const [init, setInit] = useState(true);
    const [disable, setDisable] = useState(true);
    const [disableCheck, setDisableCheck] = useState(true);
    const [file, setFile] = useState();
    const [paperType, setPaperType] = useState("Select");
    const [Url, setUrl] = useState('');
    const [requestType, setRequestType] = useState('Select');
    const [noOfCopies, setNoOfCopies] = useState();
    const [colored, setColored] = useState(true);
    const [colorType, setColorType] = useState('Select');
    const [paperSize, setPaperSize] = useState('Select');
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState();
    const [requestID, setRequestID] = useState('');

    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const schoolId = localStorage.getItem("schoolId");
    const userID = localStorage.getItem("userID");
    const email = localStorage.getItem("email");
    const department = localStorage.getItem("department");    
    const college = localStorage.getItem("college");  
    const role = localStorage.getItem("role");  
    const office = localStorage.getItem("office");  
    //Contact Info
    const name = localStorage.getItem("firstName") + " " +  localStorage.getItem("lastName");
    const [giveExam, setGiveExam] = useState(false);


    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleExam = () => {
        switch(giveExam){
            default:
                setGiveExam(false);
                break;
            case true:
                setGiveExam(false);
                break;
            case false:
                setGiveExam(true);
                break;    
        }
    }

    const handleNoOfCopies = (e) => {
        setNoOfCopies(e.target.value);
        if(!copies.test(e.target.value)){
            infoPop("Please input a proper number of copies!");
            setNoOfCopies('');
        }
    }

    const handlePaperSize = (e) => {
        setPaperSize(e.target.value);
    }

    const handlePaperType = (e) => {
        setPaperType(e.target.value);
    };

    const handleColor = (e) => {
        setColorType(e.target.value);
    };

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const getDate = () => {
        const today = new Date();
        return today.toISOString().substring(0, 10);
    };

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 7); 
        return today.toISOString().substring(0, 10);
    };
    
    const [currentDate, setCurrentDate] = useState(getDate());
    const [useDate, setUseDate] = useState('');
    const minDate = getMinDate();


    const handleUseDateChange = (e) => {
        const selectedDate = e.target.value;
        if (new Date(selectedDate) < new Date(minDate)) {
            infoPop('Please select a date at least 7 days from today!');
            setUseDate(''); // Reset the input if the date is invalid
        } else {
            setUseDate(selectedDate);
        }
    };
    const upload = () => {
        // Check if the requestType is valid (not "Select")
        const isFormValid = requestType !== 'Select' && 
                            colorType !== 'Select' &&
                            paperType !== 'Select' &&
                            paperSize !== 'Select' &&
                            noOfCopies > 0 && 
                            useDate !== '' &&
                            description !== '' &&
                            (file != null || requestType === 'Exam' );  // Allow submission if file is not selected and requestType is "Exam"
    
        if (isFormValid) {
            const data = new FormData();
            data.append('userID', userID);
            data.append('role', role);
            data.append('isHead', isHead);
            data.append('isAdmin', isAdmin);
            data.append('isStaff', isStaff);
            data.append('requestID', requestID);
            data.append('fileType', requestType);
            data.append('desc', description);
            data.append('noOfCopies', noOfCopies);
            data.append('schoolId', schoolId);
            data.append('colored', colorType);
            data.append('paperSize', paperSize);
            data.append('paperType', paperType);
            data.append('requestDate', currentDate);
            data.append('useDate', useDate);
            data.append('name', name);
            data.append('email', email);
            data.append('department', department);
            data.append('office', office);
            data.append('college', college);

            const commentData = new FormData();
            commentData.append("sentBy", name);
            commentData.append("header", "Initial Comment");
            commentData.append("content", comment);
            commentData.append("sentDate", currentDate);
            commentData.append("requestID", requestID);
    
            // Proceed with file upload only if file is required and provided
            if (file && requestType !== 'Exam') {
                setButtonSubmit(true);
                // Sending File to Firebase Storage
                storage.ref(`files/${file.name}`).put(file)
                    .on("state_changed", null, alert, () => {
                        // Getting Download Link
                        storage.ref("files")
                            .child(file.name)
                            .getDownloadURL()
                            .then((url) => {
                                setUrl(url);
                                data.append('URL', url);
                                data.append('fileName', file.name);
                                data.append('giveExam', giveExam);
    
                                // Submit Request
                                const requestOptions = {
                                    method: 'POST',
                                    mode: 'cors',
                                    body: data
                                };
    
                                fetch("https://backimps-production.up.railway.app/requests/newRequest", requestOptions)
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (comment !== '') {
                                            const requestOptionsComment = {
                                                method: 'POST',
                                                mode: 'cors',
                                                body: commentData,
                                            };
                                            fetch("https://backimps-production.up.railway.app/comments/newComment", requestOptionsComment)
                                                .then((response) => response.json())
                                                .then((data) => {
                                                    console.log(data);
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                        }
                                        infoPop('Request submitted successfully!', true);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            });
                    });
            } else if (requestType === 'Exam') {
                // No file is needed for "Exam" requests, so submit without file
                data.append('fileName', 'None');
                data.append('URL', 'None');
                data.append('giveExam', giveExam);
                const requestOptions = {
                    method: 'POST',
                    mode: 'cors',
                    body: data,
                };
                fetch("https://backimps-production.up.railway.app/requests/newRequest", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (comment !== '') {
                            const requestOptionsComment = {
                                method: 'POST',
                                mode: 'cors',
                                body: commentData,
                            };
                            fetch("https://backimps-production.up.railway.app/comments/newComment", requestOptionsComment)
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log(data);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                        infoPop('Request submitted successfully!', true);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                infoPop('Please make sure you attached a file');
            }
        } else {
            infoPop('Please make sure you filled up all the fields correctly.');
        }
    };
    
    

    const disableIn = (value) => {

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
        },
        };
        
        let tag = '';
    
        if (value === 'Module') {
            setRequestType('Module');
            tag = "MD0";
        } else if (value === 'Office') {
            setRequestType('Office Form');
            tag = "OF0";
        } else if (value === 'Exam') {
            setRequestType('Exam');
            tag = "EX0";
        } else if (value === 'Manual') {
            setRequestType('Manual');
            tag = "MA0";
        }
    
        console.log(role);
        if (value !== 'Select') {
            fetch("https://backimps-production.up.railway.app/records/generateid?fileType=" + value, requestOptions).then((response)=> response.json()
            ).then((data) => { setRequestID(tag + (data+1).toString());})
            .catch(error =>
            {
                    console.log(error);
                });
        } else {
            setRequestID("");
        }
    
        switch (value) {
            case 'Module':
            case 'Manual':
            case 'Office':
                setDisable(true);
                setInit(false);
                break;
            case 'Exam':
                setDisable(false);
                setInit(false);
                break;
            case 'Select':
                setDisable(true);
                setInit(true);
                break;
            default:
                break;
        }

        // Disable file input if "Exam" is selected
        if (value === 'Exam') {
            setDisable(true); // Disable all fields including file input
            setDisableCheck(false);
        } else {
            setDisable(false); // Enable fields for other request types
        }

    };
    

    return (
            
        <div id="reqContainer">
            <div id="infoPopOverlay" className ={alert}></div>
            <div id="infoPop" className={alert}>
                <p>{alertMsg}</p>
                <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>    
            </div>
            <h1 id='printReqHead'>PRINT REQUEST FORM</h1>
                <h2 id='reqNum'> Request#: {requestID}</h2>
                
                <div id="formBody">
                    <div className="reqLabel" >Request Type:</div>
                        <select id="reqType" onChange={(e) => disableIn(e.target.value)}> 
                            <option value='Select' >Select</option>
                            <option value="Module" >Module</option>
                            <option value="Manual" >Manual</option>
                            <option value="Exam" >Examination</option>
                            <option value="Office" >Office Form</option>
                        </select>

                
                <div className='fileDeet'>File Details</div>
                <div id="upload">File Name:</div>
                <input 
                    type="file" 
                    accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                    className="fileinput"
                    onChange={handleFile} 
                    disabled={disable} 
                />
                    {/* <div className='fileDescL'>File Description:</div> */}
                        <textarea className='fileDesc' wrap="soft" placeholder="File Description" disabled={init} value={description} onChange={(e) => {setDescription(e.target.value)}}/>
                    <div className='givePerson'>Give examination file personally:</div>
                        <input className='giveExam' type='checkbox' onChange={handleExam} disabled={disableCheck || init}/>

                    <div className='contactInfo'>Requester's Information</div>
                    <div className='name'>Name</div>
                    <input className='nameText' wrap='soft' placeholder="Name" value={name} disabled={true} />
                    <div className='email'>Email</div>
                    <input className='emailText' wrap='soft' placeholder="Email" value={email} disabled={true} />
                    {role === "Faculty Employee" ? (
                        <>
                            <div className='department'>Department</div>
                            <input className='departmentText' wrap='soft' placeholder="Department" value={department} disabled={true} />
                            <div className='college'>College</div>
                            <input className='collegeText' wrap='soft' placeholder="College" value={college} disabled={true} />
                            <div className='comments'>Additional Comments/Instructions</div>
                            <textarea className='commentBox' wrap='soft' placeholder="Comments/Instructions" value={comment} disabled={init} onChange={handleComment}/>
                        </>
                    ) : role === "Office Employee" ? (
                        <>
                            <div className='department'>Office</div>
                            <input className='departmentText' wrap='soft' placeholder="Office" value={office} disabled={true} />
                            <div className='comments' style={{marginTop: '-3vw'}}>Additional Comments/Instructions</div>
                            <textarea style={{marginTop: '-3vw'}} className='commentBox' wrap='soft' placeholder="Comments/Instructions" value={comment} disabled={init} onChange={handleComment}/>
                        </>
                    ) : null}


              
                </div>

                <div className='dateBox'>
                    <div className='dateInfo'>Dates</div>
                    <div className="reqDateL">Request Date:</div>
                    <input className='reqDate' type="date" value={currentDate} disabled="true" />
                    <div className="needDateL">Date Needed:</div>
                    <input
                        className='needDate'
                        type="date"
                        min={minDate} // Set the minimum date
                        disabled={init}
                        onChange={handleUseDateChange} // Use the updated handler
                    />
                </div>

                <div className='printBox'>
                        <div className='printInfo'>Print Specifications</div>
                        <div className='no_copies'>No. of Copies:</div>
                        <input className='copyNum' type='number' placeholder="" min='0' value={noOfCopies} disabled={init} onChange={handleNoOfCopies} />
                        
                        <div className='color'>Printing Type:</div>
                    <select id="paperColor" style={{ marginTop: '-2.5vw', marginRight: '-7.5vw' }} defaltValue={colorType} onChange={handleColor} disabled={init}>
                        <option value='Select' >Select</option>
                        <option value="Colored">Colored</option>
                        <option value="B&W">B&W</option>
                    </select>

                        <div className="paperSizeL" >Paper Size:</div>
                        <select id="paperType" defaultValue={paperSize} disabled={init} onChange={handlePaperSize}>
                            <option value='Select' >Select</option>
                            <option value="Short">Short</option>
                            <option value="Long">Long</option>
                            <option value="A4">A4</option>
                            <option value="Other">Other</option>
                        </select>

                        <div className="paperSizeL" style={{ marginTop: '2vw' }}>Paper Type:</div>
                        <select id="paperType" style={{ marginTop: '2vw' }} defaultValue={paperType} disabled={init} onChange={handlePaperType}>
                            <option value='Select' >Select</option>
                            <option value="Bondpaper">Bondpaper</option>
                            <option value="Newsprint">Newsprint</option>
                            <option value="Oslo">Oslo</option>
                        </select>
                    </div>

                        <button className='submit' disabled={buttonSubmit} onClick={upload}>Submit</button>
        </div>
    );
};

export default PrintReq;