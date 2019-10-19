import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import Admin from './components/admin/Admin';
import Event from './components/event/Event';

class Dashboard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/home' component={Home}/>
                        <Route exact path='/profile' component={Profile}/>
                        <Route exact path='/admin' component={Admin}/>
                        <Route path='/event' component={Event}/>
                    </Switch>
                </BrowserRouter>
            </React.Fragment>
        )
    }

}

export default Dashboard;