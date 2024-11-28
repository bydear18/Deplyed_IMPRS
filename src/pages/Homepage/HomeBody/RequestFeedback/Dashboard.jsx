import './Dashboard.css';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [values, setValues] = useState([]);
  const [notifShow, setNotifShow] = useState('hide');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch("http://localhost:8080/notifications/id?id=" + localStorage.getItem("userID"), requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setValues(data);
      })
      .catch(error => {
        console.log(error);
      });

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetch("http://localhost:8080/services/checkAdmin?email=" + localStorage.getItem("email"), requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data !== true) {
            setNotifShow('show');
          } else {
            setNotifShow('hide');
            fetch("http://localhost:8080/notifications/id?id=" + localStorage.getItem("userID"), requestOptions)
              .then((response) => response.json())
              .then((data) => {
                setValues(data);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setNotifShow('hide');
    }
  }, []);

  const handleContentClick = (requestID) => {
    fetch(`http://localhost:8080/comments/id?id=${requestID}`)
      .then((response) => response.json())
      .then((data) => {
        // Filter comments sent by Admin
        const adminComments = data.filter(comment => comment.sentBy === 'Head');
        setSelectedContent(adminComments); // Store the filtered comments
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent([]); // Clear the content when closing the modal
  };

  return (
    <div className="dashboard">
      <div className="notif-popup always-visible">
        <div className="notif-body">
          {values.length === 0 ? (
            <div className="notif-empty">No new notifications</div>
          ) : (
            values.map((notif, idx) => (
              <div key={idx} className="notif-item">
                <h1 className="notif-id">#{notif.requestID}</h1>
                <p className="notif-header">{notif.header}</p>
                <p className="notif-content">{notif.content}</p>
                
                <p className="notif-date">{notif.createdDate}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
