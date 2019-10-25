import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './styles/App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
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
          <Route exact path='/login' component={Login}/>
          {/* <Route exact path='/' component={Dashboard}/> */}
          <Route path='/event' component={Event}/>
          <Route exact path='/home' component={Home}/>
          <Route exact path='/profile' component={Profile}/>
          <Route exact path='/admin' component={Admin}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
