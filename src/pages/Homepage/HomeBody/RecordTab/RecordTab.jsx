import './recordtab.css';

import React, {
    useEffect,
    useState,
} from 'react';

import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

const History = ({reqHistory}) => {
    const [values, setValues] = useState(reqHistory);
    const [rejected,setRejected] = useState('hide');
    const [disabled,setDisabled] = useState(false);
    const [completeDisable, setCompleteDisable] = useState(false);
    const [commentDisabled, setCommentDisabled] = useState('hide');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const [otherComment, setOtherComment] = useState('');
    const [show, setShow] = useState('hide');
    const [commentShow, setCommentShow] = useState('hide');
    const [buttonShow, setButtonShow] = useState('hide');
    const [statusClass, setStatusClass] = useState('reqStatRejected');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const userEmail = localStorage.getItem("email");
    const schoolId = localStorage.getItem("schoolId");
    // Details
    const [selectedComment, setSelectedComment] = useState(null);
    const [requestID, setRequestID] = useState();
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [desc, setDesc] = useState('');
    const [office, setOffice] = useState('');
    const [college, setCollege] = useState('');
    const [fileName, setFileName] = useState('');
    const [giveExam, setGiveExam] = useState(false);
    const [noOfCopies, setNoOfCopies] = useState(0);
    const [colored, setColored] = useState(false);
    const [useDate, setUseDate] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [title, setTitle] = useState('');
    const [paperSize, setPaperSize] = useState('');
    const [colorType, setColorType] = useState('');
    const [paperType, setPaperType] = useState('');
    const [fileType, setFileType] = useState('');
    const [status, setStatus] = useState('');
    const [userID, setUserID] = useState('');
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState([]);
    const [requesterName, setRequesterName] = useState('');
    const [requesterEmail, setRequesterEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const firstCommentName = localStorage.getItem('firstName');
    const lastCommentName = localStorage.getItem("lastName");
 
    // Details
    const [bindType, setBindType] = useState('');

    // Comment Details
    const [commentHeader, setCommentHeader] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [commentDate, setCommentDate] = useState('');
    const [editable, setEditable] = useState(true);
    const [downloadURL, setDownloadURL] = useState('');


    const getDate = () => {
        const today = new Date();
        return today.toISOString().substring(0,10);
    }
    
    // Date Values
    const [currentDate, setCurrentDate] = useState(getDate());
    
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
    
         _filters['global'].value = value;
    
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const [commentOptions, setCommentOptions] = useState([
        { label: 'Insufficient Information', value: 'Insufficient Information' },
        { label: 'Invalid Request', value: 'Invalid Request' },
        { label: 'Other', value: 'Other' },
    ]);

    const handleAddComment = () => {
        setCommentDate(currentDate);
        setCommentHeader('');
        setEditable(false);
        setCommentContent('');
        setButtonShow('show');
        setCommentShow('show');
    }

    const handleComplete = () => {
        setCompleteDisable(true);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            };
            fetch("http://localhost:8080/records/completedStatus?requestID=" + requestID + "&role=" + role + "&status=Completed&email=" + email  + "&userID=" + userID + "&date=" + currentDate, requestOptions).then((response)=> response.json()
            ).then((data) => {window.location.reload();})
            .catch(error =>
                {
                    console.log(error);
                    
                }
            );

            setCompleteDisable(false);
    }
    
    const renderHeader = () => {
        return (
            <div id="historyHeader" className="flex">
                <h1 style={{color: '#fff'}}>Request History</h1>
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
                <h1 id='commentHeader'>Comments</h1>

            </div>
        );
    };

    const header = renderHeader();
    const commentTableHeader = renderCommentHeader();

    const createComment = () => {
        const commentData = new FormData();
        if (firstCommentName && lastCommentName) {
            commentData.append("sentBy", `${firstCommentName} ${lastCommentName}`);
        } else {
            console.error("First name and last name must be provided");
        }
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
                                                setButtonShow('show');
                                                setCommentShow('show');
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

          fetch("http://localhost:8080/requests/id?id=" + event.data.requestID + "&fileName=" + event.data.fileName, requestOptions).then((response)=> response.json()
            ).then((data) => { 
                setFileName(data['fileName']);
                setDepartment(data['department']);
                setFileType(data['fileType']);
                setColored(data['color']);
                setGiveExam(data['giveExam']);
                setDesc(data['description']);
                setRequestDate(data['requestDate']);
                setUseDate(data['useDate']);
                setRequestID(data['requestID']);
                setOffice(data['office']);
                setCollege(data['college']);
                setColorType(data['colored']);
                setNoOfCopies(data['noOfCopies']);
                setPaperSize(data['paperSize']);
                setPaperType(data['paperType']);

                if(college === ' '){
                    setRole("Faculty Employee");
                } else{
                    setRole("Office Employee");
                }


                console.log(office);
                console.log(role);
                setUserID(data['userID']);
                setEmail(data['requesterEmail']);
                setDownloadURL(data['downloadURL']);
                setRequesterEmail(data['requesterEmail']);
                setRequesterName(data['requesterName']);
                setContactNumber(data['requesterNumber']);
                fetch("http://localhost:8080/records/requestid?id=" + event.data.requestID, requestOptions).then((response)=> response.json()
                ).then((data) => { 
                    setStatus(data['status']);

                    if(data['status'] === 'Rejected'){
                        setRejected('show');
                        setCommentDisabled('show');
                    }else{
                        setRejected('show');
                        setCommentDisabled('show');
                    }
                    
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
                    } else if (data['status'] === 'Claimed') {
                        setStatus('Claimed');
                        setStatusClass('capsuleCompleted');
                    } 
                    fetch("http://localhost:8080/comments/id?id=" + event.data.requestID, requestOptions).then((response)=> response.json()
                    ).then((data) => { 
                        setComments(data);
                        if(data[0].sentBy == 'Head'){
                            setTitle('REASON FOR REJECTION');
                            setContent(data[0].content);
                            console.log(data[0].content);
                            
                        } else{
                            setTitle('ADDITIONAL INSTRUCTION');
                            setContent(data[0].content);
                        }
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

            })
            .catch(error =>
            {
                console.log(error);
            }
            );
        setShow('show');
    };

    

    const closeComment = () => {
        setCommentShow('hide');
        setButtonShow('hide');
    }

    const closeModal = () => {
        setShow('hide');
    }

    const getSeverity = (status) => {
        switch (status) {
            default:
                return 'warning';

            case 'Rejected':
                return 'danger';

            case 'Approved for Printing':
                return 'info';

            case 'Ready to Claim':
                return 'success';

            case 'Claimed':
                return 'success';
            case '':
                return null;
        }
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
        
        fetch("http://localhost:8080/records/all", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const statusMap = {
                    'Pending': 'Waiting for Approval',
                    'In Progress': 'Approved for Printing',
                    'Completed': 'Ready to Claim',
                };

                const updatedData = data.map(item => ({
                    ...item,
                    status: statusMap[item.status] || item.status,
                }));

                // Filter data and log comparisons
                const filteredData = updatedData.filter(item => {
                    console.log(`Comparing userID: ${item.userID} with schoolId: ${schoolId}`);
                    const isMatch = item.userID === schoolId;
                    if (isMatch) {
                        console.log(`Match found: userID ${item.userID} is equal to schoolId ${schoolId}`);
                    }
                    return isMatch;
                });

                setValues(filteredData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [schoolId]);
    

    return(
        <div>
            <div id="pendingTable">
                <DataTable value={values} scrollable scrollHeight="30vw" header={header} globalFilterFields={['userID', 'requestID', 'fileName', 'requestDate']}
                    filters={filters} emptyMessage="No records found."
                    paginator rows={8}
                    tableStyle={{ minWidth: '20vw' }} selectionMode="single" onRowSelect={onRowSelect}>
                    <Column field="userID" header="User ID"></Column>
                    <Column field="requestID" header="Request ID"sortable></Column>
                    <Column field="fileType" header="File Type"sortable></Column>
                    <Column field="fileName" header="File Name"></Column>
                    <Column field="requestDate" header="Request Date"></Column>
                    <Column field="useDate" header="Use Date"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate}sortable></Column>
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

                    <div id='requester'>
                    Request from: <div id='schoolId'>{schoolId}</div>
                    </div>


                    <div id='fileDeets'>FILE DETAILS</div>

                    <div id='secondLine'>
                        <p>File Name:</p> <input id='nameOfFile' type='text' disabled='true' value={fileName} />
                    </div>

                    <textarea id='descriptionOfFile' disabled='true' value={desc}>{desc}</textarea>

                    <div id='thirdLine'>
                        <div id='hatagExam'>Give exam personally: </div>
                        <input id='examBox' type='checkbox' checked={giveExam} disabled='true' />
                    </div>
                    <br></br>
                    <div id='fileDeets' style={{marginBottom:'.5vw'}}>PRINT SPECS</div>

                    <div id='fourthLine'>
                        <p id='coloredBa'>Color Type:<p className='specText'>{colorType}</p>
                            <div id='numberCopies' style={{marginBottom:'.5vw'}}># of Copies: <p className='specText'>{noOfCopies}</p>
                            </div>
                        </p>
                    </div>
                    <div id='fourthLine'>
                        <p id='coloredBa' style={{marginTop: '-1vw'}}>Paper Size:<p className='specText'>{paperSize}</p>
                            <div id='numberCopies'>PaperType: <p className='specText'>{paperType}</p></div>
                        </p>
                    <br></br>
                    </div>
                    <div id='contactDeets' style={{marginBottom:'.5vw'}}>REQUESTER'S INFORMATION</div>
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
                            <div id="overlay" className = {commentShow} onClick={closeComment}></div>
                            <div id="deetCommentBody" className ={commentShow}>
                                <div id='commBod'>
                                    <p>{commentDate}</p>
                                    <textarea value={commentContent} disabled={editable} id='commContent' placeholder="Enter comment content..." onChange={(e)=>{setCommentContent(e.target.value)}}/>
                                    <button id='inAdd' className={buttonShow} onClick={createComment}>Add Comment</button>
                                </div>
                            </div>
                </div>
                <button id='addComment' className={commentDisabled} onClick={handleAddComment}>Add Comment</button>
                <DataTable value={comments} header={commentTableHeader}
                                    scrollable scrollHeight="17.48vw"
                                    emptyMessage="No comments found." id='tabledComments'
                                    paginator rows={5}
                                    tableStyle={{ minWidth: '5vw' }} selectionMode="single" onRowSelect={onCommentSelect}>
                                    <Column field="sentBy" header="Sent by"></Column>
                                    <Column field="content" header="Content"></Column>
                                    <Column field="sentDate" header="Date"></Column>
                            </DataTable>

            </div>
        </div>
    );
};

export default History;