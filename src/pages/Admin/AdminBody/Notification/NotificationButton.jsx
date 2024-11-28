
import { HiBell } from 'react-icons/hi2';
import Popup from 'reactjs-popup';
import {
  useEffect,
  useState,
} from 'react';

const NotificationButton = () => {
  const [values, setValues] = useState([]);
  const [notifShow, setNotifShow] = useState('hide');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch("https://backimps-production.up.railway.app/notifications/id?id=" + localStorage.getItem("userID"), requestOptions).then((response) => response.json()
    ).then((data) => { setValues(data); })
    .catch(error =>
      {
        console.log(error);
      }
    );

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetch("https://backimps-production.up.railway.app/services/checkAdmin?email=" + localStorage.getItem("email"), requestOptions).then((response) => response.json()
      ).then((data) => {
        if (data !== true) {
          setNotifShow('show');
        } else {
          setNotifShow('hide');
          fetch("https://backimps-production.up.railway.app/notifications/id?id=" + localStorage.getItem("userID"), requestOptions).then((response) => response.json()
          ).then((data) => { setValues(data); })
          .catch(error =>
            {
              console.log(error);
            }
          );
        }
      })
    .catch(error =>
      {
        console.log(error);
      }
    );
    } else {
      setNotifShow('hide');
    }
  }, []);

  return (
    <Popup trigger=
      {<button id='notifbutt' className={notifShow}> <HiBell id='notifIcon' /> </button>}
      position="left top">
      <div id='panel' scrollable>
        <div id='notifHead'>NOTIFICATIONS</div>
        {/* <hr id='notdivider'/> */}
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
  );
};

export default NotificationButton;