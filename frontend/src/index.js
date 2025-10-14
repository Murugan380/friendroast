import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';
import App from './User/App';
import Login from './User/login';
import Chat from './User/Chat'
import Admin from './admin/admin'
import Logout from './User/logout'
import { BrowserRouter as Router,Route,Routes} from "react-router-dom"
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route exact path='/' element={<Login/>}></Route>
      <Route exact path='/signin' element={<App/>}></Route>
      <Route exact path='/chat' element={<Chat/>}></Route>
      <Route exact path='/logout' element={<Logout/>}></Route>
      <Route exact path='/admin' element={<Admin/>}></Route>
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
