import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import Admin from './components/admin/Admin';
import Event from './components/event/Event';
import Header from "./components/shared/Header";

// path={`${match.url}app`}

class Dashboard extends Component {
    render() {

        //TODO uncomment to enforce that the user is logged in before having access to below router
        if (!window.isAuth) {
            return <Redirect to={'/login'} />
        }

        return (
            <Fragment>
                <div id="app-main" className="app-main">
                    <div>
                        <Header />
                    </div>
                    <Switch>
                        <Route path='/event' component={Event} />
                        <Route path='/home' component={Home} />
                        <Route path='/profile' component={Profile} />
                        <Route path='/admin' component={Admin} />
                        {window.isAdmin ?
                            <Route path='/' component={Admin} />
                            :
                            <Route path='/' component={Home} />
                        }

                    </Switch>
                </div>
            </Fragment>
        );

    }
}

export default Dashboard;
