import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import './headpending.css';

const Pending = () => {
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState('hide');
    const [rejected,setRejected] = useState('hide');
    const [alertMsg, setAlertMsg] = useState('');
    const [show, setShow] = useState('hide');
    const [buttonShow, setButtonShow] = useState('hide');
    const [commentShow, setCommentShow] = useState('hide');
    const [rejectDisable, setRejectDisable] = useState(false);
    const [statusClass, setStatusClass] = useState('reqStatRejected');
    const [values, setValues] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [commentDisabled, setCommentDisabled] = useState('hide');

    const [commentOptions, setCommentOptions] = useState([
        { label: 'Insufficient Information', value: 'Insufficient Information' },
        { label: 'Invalid Request', value: 'Invalid Request' },
        { label: 'Other', value: 'Other' },
    ]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [otherComment, setOtherComment] = useState('');
    
    const [requestID, setRequestID] = useState();
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [desc, setDesc] = useState('');
    const [fileName, setFileName] = useState('');
    const [giveExam, setGiveExam] = useState(false);
    const [noOfCopies, setNoOfCopies] = useState(0);
    const [colored, setColored] = useState(false);
    const [useDate, setUseDate] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [paperSize, setPaperSize] = useState('');
    const [colorType, setColorType] = useState('');
    const [paperType, setPaperType] = useState('');
    const [fileType, setFileType] = useState('');
    const [status, setStatus] = useState('');
    const [userID, setUserID] = useState('');
    const [schoolId, setSchoolId]= useState('');
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState([]);
    const [requesterName, setRequesterName] = useState('');
    const [requesterEmail, setRequesterEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [downloadURL, setDownloadURL] = useState('');
    const [success, setSuccess] = useState(false);
    // Comment Details
    const [commentHeader, setCommentHeader] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentDate, setCommentDate] = useState('');
    const [office, setOffice] = useState('');
    const [college, setCollege] = useState('');
    const [editable, setEditable] = useState(true);

    const getDate = () => {
        const today = new Date();
        return today.toISOString().substring(0, 10);
    };
    const [infoPopUpVisible, setInfoPopUpVisible] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    
    const handleCommentChange = (event) => {
        const value = event.value;
        setSelectedComment(value);

        if (value === 'Other') {
            setCommentShow('show'); 
        } else {
            setCommentShow('hide'); 
            setOtherComment(''); 
        }
    };

    const [isRejectClick, setIsRejectClick] = useState(false);

    const createComment = () => {
        const commentData = new FormData();
        commentData.append("sentBy", "Head");
        commentData.append("header", commentHeader);
        commentData.append("content", commentContent);
        commentData.append("sentDate", commentDate);
        commentData.append("requestID", requestID);
        
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            };
            if(commentContent!=null && commentContent!==''){
                const requestOptionsComment = {
                    method: 'POST',
                    mode: 'cors',
                    body: commentData
                  };
                fetch("http://localhost:8080/comments/newComment", requestOptionsComment)
                .then((response)=> response.json()
                                        ).then((data) => {
                                            fetch("http://localhost:8080/comments/id?id=" + requestID, requestOptions).then((response)=> response.json()
                                            ).then((data) => { 
                                                setComments(data);
                                                setEditable(true);
                                                setButtonShow('hide');
                                                setCommentShow('hide');
                                            })
                                            .catch(error =>
                                            {
                                                console.log(error);
                                            }
                                            );
                                        })
                                        .catch(error =>
                                        {
                                            console.log(error);
                                        }
                                    );
                }

    }

    const showInfoPop = (message, isSuccess = false) => {
        setAlert('show');
        setAlertMsg(message);
        setSuccess(isSuccess);
      };


      const closeInfoPop = () => {
        setAlert('hide');
      };

    // Date Values
    const [currentDate, setCurrentDate] = useState(getDate());

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const handleAddComment = () => {
        setCommentDate(currentDate);
        setCommentHeader('');
        setEditable(false);
        setCommentContent('');
        setButtonShow('show');
        setCommentShow('show');
    }

    const handleAccept = () => {
        setIsRejectClick(false);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(
            "http://localhost:8080/records/acceptedStatus?requestID=" + requestID + 
            "&status=In Progress&email=" + email + 
            "&userID=" + userID + 
            "&date=" + currentDate + 
            "&schoolId=" + schoolId + 
            "&role=" + role,
            requestOptions
        )
        .then((response) => response.json())
        .then((data) => {
            showInfoPop('Request Accepted.');
            setTimeout(() => {
                window.location.reload();
            }, 3000); 
        })
        .catch((error) => {
            console.log(error);
        });
    };
    

    const handleReject = () => {
        setIsRejectClick(true); 
        setCommentDate(currentDate);
        setCommentHeader("Reason for Rejection");
        setRejectDisable(false);
        setEditable(false);
        setCommentContent('');
        setButtonShow('show');
        setCommentShow('show');
    };

    const proceedReject = (selectedComment) => {
        setRejectDisable(true);
        const commentData = new FormData();
        commentData.append("sentBy", "Head");
        commentData.append("header", commentHeader);
        commentData.append("content", selectedComment);
        commentData.append("sentDate", commentDate);
        commentData.append("requestID", requestID);
        
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (selectedComment != null && selectedComment !== '') {
            const requestOptionsComment = {
                method: 'POST',
                mode: 'cors',
                body: commentData
            };
            fetch("http://localhost:8080/comments/newComment", requestOptionsComment)
            .then((response) => response.json())
            .then((data) => {
                fetch("http://localhost:8080/records/rejectedStatus?requestID=" + requestID + "&status=Rejected&email=" + email + "&userID=" + userID + "&date=" + currentDate + "&role=" + role, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        showInfoPop(`Request Rejected!`, true);
                        setTimeout(() => {
                            setInfoPopUpVisible(false); 
                            setEditable(true);
                            setButtonShow('hide');
                            setCommentShow('hide');
                            window.location.reload();
                        }, 3000);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    const renderHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1 style={{color: '#fff'}}>Pending Requests</h1>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </IconField>
            </div>
        );
    };

    const renderCommentHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1 style={{color: '#fff'}} id='commentHeader'>Comments</h1>
            </div>
        );
    };

    const header = renderHeader();
    const commentTableHeader = renderCommentHeader();

    const onCommentSelect = (event) => {
        setCommentDate(event.data.sentDate);
        setCommentHeader(event.data.header);
        setCommentContent(event.data.content);
        setCommentShow('show');
    }

    const onRowSelect = (event) => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("http://localhost:8080/requests/id?id=" + event.data.requestID + "&fileName=" + event.data.fileName, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setFileName(data['fileName']);
                setDepartment(data['department']);
                setFileType(data['fileType']);
                setColored(data['color']);
                setGiveExam(data['giveExam']);
                setDesc(data['description']);
                setRequestDate(data['requestDate']);
                setUseDate(data['useDate']);
                setRequestID(data['requestID']);
                setSchoolId(data['schoolId']);
                setOffice(data['office']);
                setCollege(data['college']);
                setColorType(data['colored']);
                setNoOfCopies(data['noOfCopies']);
                setPaperSize(data['paperSize']);
                setPaperType(data['paperType']);
                setRole(data['role']);
                setUserID(data['userID']);
                setEmail(data['requesterEmail']);
                setDownloadURL(data['downloadURL']);
                setRequesterEmail(data['requesterEmail']);
                setRequesterName(data['requesterName']);
                setContactNumber(data['requesterNumber']);

                console.log(role);

                fetch("http://localhost:8080/records/requestid?id=" + event.data.requestID, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        setStatus(data['status']);

                        if (data['status'] === 'Rejected') {
                            setStatus('Rejected');
                            setStatusClass('capsuleRejected');
                        } else if (data['status'] === 'Pending') {
                            setStatus('Waiting for Approval');
                            setStatusClass('capsulePending');
                        } else if (data['status'] === 'In Progress') {
                            setStatus('Approved for Printing');
                            setStatusClass('capsuleProgress');
                        } else if (data['status'] === 'Completed') {
                            setStatus('Ready to Claim');
                            setStatusClass('capsuleCompleted');
                        }
                        fetch("http://localhost:8080/comments/id?id=" + event.data.requestID, requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                setComments(data);
                                setContent(data[0].content);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        setShow('show');
    };

    const getSeverity = (status) => {
        switch (status) {
            default:
                return 'info';

            case 'New Request':
                return 'info';

            case 'Pending':
                return 'warning';

            case '':
                return null;
        }
    };

    const closeComment = () => {
        setCommentDate('');
        setCommentHeader('');
        setCommentContent('');
        setCommentShow('hide');
    };

    const closeModal = () => {
        setShow('hide');
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch("http://localhost:8080/records/pending", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const updatedData = data.map(item => {
                    const requestDate = new Date(item.requestDate);
                    const today = new Date();
                    requestDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    console.log(requestDate, today);
                    return {
                        ...item,
                        status: requestDate >= today ? 'New Request' : item.status
                    };
                });
                setValues(updatedData);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                setError('Failed to fetch data. Please try again later.');
            });
    }, []);

    
    return (
        <div>
            <div id="pendingTable">
                <DataTable value={values} scrollable scrollHeight="30vw" header={header} globalFilterFields={['requestersName', 'requestID', 'fileName', 'requestDate']}
                    filters={filters} emptyMessage="No records found."
                    paginator rows={8}
                    tableStyle={{ minWidth: '20vw' }} selectionMode="single" onRowSelect={onRowSelect}>
                    <Column field="requestersName" header="Requester's name"></Column>
                    <Column field="requestID" header="Request ID" sortable></Column>
                    <Column field="fileType" header="File Type" sortable></Column>
                    <Column field="fileName" header="File Name"></Column>
                    <Column field="requestDate" header="Request Date"></Column>
                    <Column field="useDate" header="Use Date"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                </DataTable>
            </div>
            <div id="overlay" className={show} onClick={closeModal}></div>
            <div id="requestBox" className={show}>
                <div id='boxDeets'>
                    <div id='firstLine'>
                        <h1 id='requestID'>{requestID}</h1>
                        <div className={statusClass}>{status}</div>
                        <p id='typeOfFile'>• {fileType}</p>
                        <p className='dates'>Date Requested: <p id='dateRequest'>{requestDate}</p></p>
                        <p className='dates'>Date Needed: <p id='dateUse'>{useDate}</p></p>
                    </div>
    
                    <p id='requester'>Request from:<p id='schoolId'>{schoolId}</p></p>
    
                    <div id='fileDeets'>FILE DETAILS</div>
    
                    <div id='secondLine'>
                        <p>File Name:</p> <input id='nameOfFile' type='text' disabled='true' value={fileName} />
                    </div>
    
                    <textarea id='descriptionOfFile' disabled='true' value={desc}>{desc}</textarea>
    
                    <div id='thirdLine'>
                        <div id='hatagExam'>Give exam personally: </div>
                        <input id='examBox' type='checkbox' checked={giveExam} disabled='true' />
                    </div>
                    <br />
                    <div id='fileDeets' style={{ marginBottom: '.5vw' }}>PRINT SPECS</div>
    
                    <div id='fourthLine'>
                        <p id='coloredBa'>Color Type:<p className='specText'>{colorType}</p>
                            <div id='numberCopies' style={{ marginBottom: '.5vw' }}># of Copies: <p className='specText'>{noOfCopies}</p>
                            </div>
                        </p>
                    </div>
                    <div id='fourthLine'>
                        <p id='coloredBa' style={{ marginTop: '-1vw' }}>Paper Size:<p className='specText'>{paperSize}</p>
                            <div id='numberCopies'>PaperType: <p className='specText'>{paperType}</p></div>
                        </p>
                        <br />
                    </div>
                    <div id='contactDeets' style={{ marginBottom: '.5vw' }}>REQUESTER'S INFORMATION</div>
                    <div className='infoLine'>Name: <div className='contactItem'>{requesterName}</div></div>
                    <div className='infoLine'>Email: <div className='contactItem'>{requesterEmail}</div></div>
                    {role === "Faculty Employee" ? (
                        <>
                            <div className='infoLine'>Department: <div className='contactItem'>{department}</div></div>
                            <div className='infoLine'>College: <div className='contactItem'>{college}</div></div>
                        </>
                    ) : role === "Office Employee" ? (
                        <>
                            <div className='infoLine'>Office: <div className='contactItem'>{office}</div></div>
                        </>
                    ) : null}
                    <div id="overlay" className={commentShow} onClick={closeComment}></div>
                    <div id="deetCommentBody" className={commentShow}>
                        {isRejectClick ? (
                            // Show Reject Comment Section
                            <div id='commBod'>
                                <p>{commentDate}</p>
                                <input type='text' value={commentHeader} onChange={(e) => setCommentHeader(e.target.value)} disabled='true' id='commHead' />
                                <Dropdown value={selectedComment} options={commentOptions} onChange={(e) => setSelectedComment(e.value)} placeholder="Select a reason" />
                                {selectedComment === 'Other' && (
                                    <div>
                                        <textarea
                                            className='showOther'
                                            placeholder="Please specify..."
                                            value={otherComment}
                                            onChange={(e) => setOtherComment(e.target.value)}
                                        />
                                        <button id='inAdd' style={{ marginTop: '10vw' }} className={buttonShow} onClick={() => proceedReject(otherComment)} disabled={rejectDisable}>Reject</button>
                                    </div>
                                )}
                                {selectedComment !== 'Other' && (
                                    <button id='inAdd' style={{ marginTop: '10vw' }} className={buttonShow} onClick={() => proceedReject(selectedComment)} disabled={rejectDisable}>Reject</button>
                                )}
                            </div>
                        ) : (
                            // Show Add Comment Section
                            <div id='commBod'>
                                <p>{commentDate}</p>
                                <textarea value={commentContent} disabled={editable} id='commContent' placeholder="Enter comment content..." onChange={(e) => { setCommentContent(e.target.value) }} />
                                <button id='inAdd' style={{marginTop: '2vw'}} className={buttonShow} onClick={createComment}>Add Comment</button>
                            </div>
                        )}
                    </div>
                </div>
                <DataTable value={comments} header={commentTableHeader}
                    scrollable scrollHeight="17.48vw"
                    emptyMessage="No comments found." id='tableOfComments'
                    paginator rows={5}
                    tableStyle={{ minWidth: '2vw' }} selectionMode="single" onRowSelect={onCommentSelect}>
                    <Column field="sentBy" header="Sent by"></Column>
                    <Column field="content" header="Content"></Column>
                    <Column field="sentDate" header="Date"></Column>
                </DataTable>
                <button id='addComment' className={commentDisabled} onClick={handleAddComment}>Add Comment</button>
                <div id='columnizer'>
                    <a id='pendingGetRequest' href={downloadURL} target="_blank" download onClick={closeModal}>Get Request File</a>
                    <button id='rejected' className='pendButtons' onClick={handleReject}>Reject</button>
                    <button id='approved' className='pendButtons' onClick={handleAccept}>Accept</button>
                </div>
            </div>
        </div>
    );
    
};

export default Pending;
