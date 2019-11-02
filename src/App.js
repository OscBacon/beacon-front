import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.scss';

import Dashboard from './Dashboard';
import Event from './components/event/Event';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import Admin from './components/admin/Admin';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' component={Dashboard}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
