import { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaFileAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

const Dashboard = () => {
  const [values, setValues] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const [rejected,setRejected] = useState('hide');
  const [disabled,setDisabled] = useState(false);
  const [completeDisable, setCompleteDisable] = useState(false);
  const [commentDisabled, setCommentDisabled] = useState('hide');

  const [show, setShow] = useState('hide');
  const [commentShow, setCommentShow] = useState('hide');
  const [buttonShow, setButtonShow] = useState('hide');
  const [statusClass, setStatusClass] = useState('reqStatRejected');

  // Details
  const [selectedComment, setSelectedComment] = useState(null);
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
  const [title, setTitle] = useState('');
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
  const [alert, setAlert] = useState('hide');
  const [alertMsg, setAlertMsg] = useState('');
  const [success, setSuccess] = useState(false);
  // Comment Details
  const [commentHeader, setCommentHeader] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentDate, setCommentDate] = useState('');
  const [editable, setEditable] = useState(true);

  const [downloadURL, setDownloadURL] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // State to track selected status

  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalStaff: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    claimedRequests: 0,
  });

  useEffect(() => {
    fetch("https://backimps-production.up.railway.app/records/requestCounts")
      .then((response) => response.json())
      .then((data) => {
        setStatistics((prevState) => ({
          ...prevState,
          pendingRequests: data.pendingRequests || 0,
          inProgressRequests: data.inProgressRequests || 0,
          completedRequests: data.completedRequests || 0,
          rejectedRequests: data.rejectedRequests || 0,
          claimedRequests: data.claimedRequests || 0,
        }));
      })
      .catch((error) => console.error("Error fetching request counts:", error));
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch("https://backimps-production.up.railway.app/records/all", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setValues(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const renderHeader = () => {
    return (
      <div id="historyHeader" className="flex">
        <h1 style={{color: '#fff'}}>{selectedStatus || 'All Requests'}</h1> {/* Show selected status or default */}
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
        </IconField>
      </div>
    );
  };
  const header = renderHeader();



  const handleBoxClick = (status) => {
    setSelectedStatus(status);
  
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // Fetch all records from the backend
    fetch(`https://backimps-production.up.railway.app/records/all`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const statusMap = {
          'Waiting for Approval': 'Pending',
          'Approved for Printing': 'In Progress',
          'Ready to Claim': 'Completed',
          'Claimed': 'Claimed',
          'Rejected': 'Rejected',
        };
        
        const updatedData = data
          .map(item => ({
            ...item,
            status: statusMap[item.status] || item.status,
          }))
          .filter(item => item.status === statusMap[status]);
  
        setValues(updatedData);
      })
      .catch((error) => {
        console.log('Error fetching data based on status:', error);
      });
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

        case 'Completed':
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


  return (
    <div id='dashboardPage' style={{height: '40vw' }}>
      <div className="dashboard-container">
        <div className="box-container">
          {/* Request status boxes */}
          <div className="box" onClick={() => handleBoxClick('Approved for Printing')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#4a90e2' }} className="icon" />
              <p className="box-text">Approved for Printing</p>
            </div>
            <div className="extra-box">
              <p className="count">
                {statistics.inProgressRequests}
              </p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Waiting for Approval')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#c04a27' }} className="icon" />
              <p className="box-text">Waiting for Approval</p>
            </div>
            <div className="extra-box">
              <p className="count">
                {statistics.pendingRequests}
              </p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Ready to Claim')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#08af5c' }} className="icon" />
              <p className="box-text">Ready to Claim</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.completedRequests}</p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Claimed')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#0a753f' }} className="icon" />
              <p className="box-text">Claimed</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.claimedRequests}</p>
            </div>
          </div>

          <div className="box" onClick={() => handleBoxClick('Rejected')}>
            <div className="content-box">
              <FaCheckCircle style={{ color: '#681016' }} className="icon" />
              <p className="box-text">Rejected Requests</p>
            </div>
            <div className="extra-box">
              <p className="count">{statistics.rejectedRequests}</p>
            </div>
          </div>
        </div>

        <div id="pendingTable">
            <DataTable value={values} scrollable scrollHeight="20vw" header={header} globalFilterFields={['userID', 'requestID', 'fileName', 'requestDate']}
                filters={filters} emptyMessage="No records found."
                paginator rows={8}
                tableStyle={{ minWidth: '20vw' }} selectionMode="single">
                <Column field="userID" header="User ID"></Column>
                <Column field="requestID" header="Request ID"sortable></Column>
                <Column field="fileType" header="File Type"sortable></Column>
                <Column field="fileName" header="File Name"></Column>
                <Column field="requestDate" header="Request Date"></Column>
                <Column field="useDate" header="Use Date"></Column>
            </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
