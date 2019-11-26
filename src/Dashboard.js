import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import Admin from './components/admin/Admin';
import Event from './components/event/Event';
import Header from "./components/shared/Header";

import {getCurrentUser} from "./api/users";

// path={`${match.url}app`}

class Dashboard extends Component {
    async componentDidMount() {
        const current = await getCurrentUser();
        console.log("Logged on", current);
        if(!current){
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <Fragment>
                <div id="app-main" className="app-main">
                    <div>
                        <Header history={this.props.history}/>
                    </div>
                    <Switch>
                        <Route path='/event/:id' component={Event} />
                        <Route path='/home' component={Home} />
                        <Route path='/profile/:id' component={Profile} />
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
