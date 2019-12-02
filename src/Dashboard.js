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

    constructor(props){
        super(props);
        this.state = {
            authenticated: false
        }
    }

    async componentDidMount() {
        const current = await getCurrentUser();
        console.log("Logged on", current);
        if(!current){
            this.setState({authenticated: false}, () => {
                this.props.history.push('/login');
            })
        }
        else{
            this.setState({authenticated: true});
        }
    }

    render() {
        const {authenticated} = this.state;
        
        return (
            <Fragment>
                {!authenticated ?
                    <div/>
                    :  
                    <div id="app-main" className="app-main h-100 w-100">
                        <div>
                            <Header history={this.props.history}/>
                        </div>
                        <div style={{height: "88vh"}}>
                            <Switch>
                                <Route path='/home' component={Home} />
                                <Route path='/event/:id' component={Event} />
                                <Route path='/profile/:id' component={Profile} />
                                <Route path='/admin' component={Admin} />
                                {window.isAdmin ?
                                    <Route path='/' component={Admin} />
                                    :
                                    <Route path='/' component={Home} />
                                }

                            </Switch>
                        </div>
                    </div>
                }
            </Fragment>
        );

    }
}

export default Dashboard;
