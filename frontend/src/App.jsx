//importing functional components, functions and libraries
import "./components/styles/App.module.css";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import SpecialPage from "./components/pages/SpecalPage";
import TitleIndex from "./components/pages/TitleIndex";
import EmployeeDetails from "./components/pages/EmployeeDetails";
import TimeSheet from "./components/pages/TimeSheet";
import Home from "./components/pages/Home";
import LeaveRequest  from "./components/pages/LeaveRequest";
import DailyAttendance from "./components/pages/DailyAttendance";
import PaySlip from "./components/pages/PaySlip";
import ITSupport from "./components/pages/ITSupport";
import Bullet from "./components/pages/Bullet";
import LogOut from "./components/pages/LogOut";
import login from "./components/pages/login";
import PasswordReset from "./components/pages/PasswordReset";





import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



// import Page from "./components/pages/Page";

import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//main app function which is also a functional component that will be pased to main.jsx
function App() {
  return (
    <>
      {/* more on this component on sonner website */}
      <Toaster duration={2000} position="top-center" richColors closeButton />
      {/* router here */}
      <Router>
        <Switch>
        
          <Route path="/special-page" component={SpecialPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login-page"  component={LoginPage} />
         <Route path="/titleindex" component={TitleIndex} />
         <Route path ="/employee-details" component={EmployeeDetails} />
         <Route path ="/home" component={Home} />
         <Route path="/timesheet" component={TimeSheet} />
         <Route path="/leaverequest" component={LeaveRequest} />
         <Route path="/dailyattendance" component={DailyAttendance} />
         <Route path="/PaySlip" component={PaySlip} />
         <Route path="/ITSupport" component={ITSupport} />
         <Route path ="/bullet" component={Bullet} />
         <Route path="/password-reset" component={PasswordReset} />
         <Route path ="/logout" component={LogOut} />
         <Route path ="/"  exact component={login} />
  

         

     
          {/* <Route path="*" component={Page} /> */}
         

        </Switch>
      </Router>
    </>
  );
}

//exporting this
export default App;
