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
            authenticated: false,
            admin: false,
        }
    }

    async componentDidMount() {
        try{
            const current = await getCurrentUser();
            console.log("Logged on", current);
            const newState = {authenticated: true}
            if(current.email === "admin@beacon.ca"){
                newState.admin = true;
            }
            this.setState(newState);
        }
        catch(e){
            console.log("Not Logged On");
            this.setState({authenticated: false}, () => {
                this.props.history.push('/login');
            })
        }
    }

    render() {
        const {authenticated, admin} = this.state;
        
        return (
            <Fragment>
                {!authenticated ?
                    <div/>
                    :  
                    <div id="app-main" className="app-main h-100 w-100">
                        <div>
                            <Header admin={admin} history={this.props.history}/>
                        </div>
                        <div style={{height: "88vh"}}>
                            <Switch>
                                <Route path='/home' 
                                    render={(props) => <Home {...props} admin={admin} />}
                                />
                                <Route path='/event/:id' 
                                    render={(props) => <Event {...props} admin={admin} />}
                                />
                                <Route path='/profile/:id' 
                                    render={(props) => <Profile {...props} admin={admin} />}
                                />
                                <Route path='/admin' 
                                    render={(props) => <Admin {...props} admin={admin} />}
                                />
                            </Switch>
                        </div>
                    </div>
                }
            </Fragment>
        );

    }
}

export default Dashboard;
