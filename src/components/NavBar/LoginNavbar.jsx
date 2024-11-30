import './Navbar.css';

import {
  useEffect,
  useState,
} from 'react';

const LoginNavbar = () => {
      const [values, setValues] = useState([]);
      const [notifShow, setNotifShow] = useState('hide');

      useEffect(() => {
        if(localStorage.getItem("isLoggedIn")==="true"){
          setNotifShow('show');

          const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
          },
          };
        
          fetch("https://backimps-production.up.railway.app/notifications/id?id=" + localStorage.getItem("userID"), requestOptions).then((response)=> response.json()
          ).then((data) => { setValues(data);})
          .catch(error =>
              {
                  console.log(error);
              }
          );
        }
      },[]);
  
  
    return (
      <div className = 'navBar flex'>
          <div className="navBarOne flex">
            <div className='citlogo'></div>
              {/* <div className='helloUser'>Hello, USER!</div> */}
          </div>
      </div>
    )
  }
  
  export default LoginNavbar;