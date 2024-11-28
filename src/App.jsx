import { useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import Adminpage from './pages/Admin/Adminpage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Staffpage from './pages/Staffpage/Staffpage';
import Headpage from './pages/Headpage/Headpage';
const App = () => {

  useEffect(() => {
    const createDefaultUsers = async () => {
      try {
        const adminEmail = "admin@cit.edu";
        const headEmail = "head@cit.edu";
        const response = await axios.post('http://localhost:8080/services/createDefaultUsers', {
          adminEmail: adminEmail,
          headEmail: headEmail
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error creating default users", error);
      }
    };

    createDefaultUsers();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/admin" element={<Adminpage />} />
          <Route exact path="/home" element={<Homepage />} />
          <Route exact path="/head" element={<Headpage />} />
          <Route exact path="/staff" element={<Staffpage />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
