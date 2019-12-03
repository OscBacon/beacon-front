import React from 'react';
import {Table} from 'react-bootstrap';
import dummyEvents from "../../static/dummyEvents";
import dummyUsers from "../../static/dummyUsers";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import CardTable from "./CardTable";
import Unauthorized from "../shared/Unauthorized"
import Header from "../shared/Header";
import Pagination from "react-bootstrap/Pagination";


import {searchQuery, getStats} from '../../api/admin';

class Admin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            searchText: '',
            searchResults: null,
            searchMode: "event",
            page: 1,
            searching: false,
        }
    }

    componentDidMount() {
       //  {title: "Users Online",  figure: "1"},
        // fetch data here

        const keyToTitle = {
            "events": "Number of Events:",
            "comments": "Number of Comments:",
            "attendings": "Number of Attendings:",
            "users": "Number of Users:",
        }

        getStats().then((result) => {
            const data = result.data.map((field, index) => {
                return {title: keyToTitle[field.name], figure: field.value}
            })
            this.setState({data});
        })         
    }

    renderAnalyticsCard = (item) => {
        return (
          <React.Fragment>
              <h6>{item.title}</h6>
              <span>{item.figure}</span>
          </React.Fragment>
        );
    };

    search = () => {
        const {searchText, searchMode} = this.state;

        searchQuery(searchMode, searchText).then((result) => {
            this.setState({searchResults: result});
        });
    }

    render() {
        const { data, searchMode, page, searchText, searchResults} = this.state;
        const {admin} = this.props;

        if(!admin){
            return (
                <Unauthorized/>
            );
        }

        return (
            <div>
                <div className="h-100 w-100">
                    <div className="w-75 mr-auto ml-auto">
                        <div className="w-100 text-center">
                            <h1 className="mt-2">Admin Dashboard</h1>
                        </div>
                        <h2 className="mt-3 mb-4">Search</h2>
                        <div style={{width: 500}} className="mr-auto ml-auto">
                            <div className="w-100 text-center">
                                <span className="mt-3">
                                    <h5 className="d-inline-block mr-2" >Search for a:</h5>
                                    <ButtonGroup aria-label="type" className="border-0">
                                        <Button className={searchMode === "event" ? "bg-primary" : "bg-white text-primary"} onClick={() => {this.setState({searchMode: "event", searchResults: null})}}>Event</Button>
                                        <Button className={searchMode === "event" ? "bg-white text-primary" : "bg-primary"} onClick={() => {this.setState({searchMode: "user", searchResults: null})}}>Profile</Button>
                                    </ButtonGroup>
                                </span>
                            </div>
                            <div className="row mt-3 no-gutters">
                                <div className="col-10">
                                    <Form className="d-inline">
                                        <Form.Group className="mb-0">
                                            <Form.Control
                                                        onChange={(e) => this.setState({searchText: e.target.value})}
                                                        type="text"
                                                        placeholder="Enter Search" />
                                        </Form.Group>
                                    </Form>
                                </div>
                                <div className="col-2">
                                    <Button onClick={this.search} className="d-inline m-0 w-100">
                                        Search
                                    </Button>
                                </div>
                                
                                { (searchText.length > 0 && searchResults) &&  
                                    <div className="w-100 border" style={{height: 200, overflowY: "scroll"}}>
                                        {searchResults.length === 0 ? 
                                            <div> No search results </div> 
                                        :
                                            <React.Fragment>
                                                {searchMode === "event" ?
                                                    <table>
                                                         <tr>
                                                            <th className="p-1"> Event </th>
                                                            <th className="p-1"> Host </th>
                                                         </tr>
                                                         {searchResults.map((event, index) => {
                                                            return (
                                                                <tr key={`event_${index}`}>
                                                                    <td className="p-1">
                                                                        <Link id='currEvent' to={`/event/${event._id}`}>{event.title}</Link>
                                                                    </td>
                                                                    <td className="p-1">
                                                                        <Link id='currEventUser' to={`/profile/${event.created_by._id}`}>{event.created_by.user_name}</Link>        
                                                                    </td>                                                                    
                                                                </tr>
                                                            );
                                                        })}
                                                    </table> 
                                                :
                                                searchResults.map((user, index) => {
                                                    return (
                                                        <div key={`user_${index}`}>
                                                            <Link id='currUser' to={`/profile/${user._id}`}>{user.user_name}</Link>
                                                        </div>
                                                    );
                                                })
                                                }
                                            </React.Fragment>   
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="mt-4 mb-4">Note: you can only search for events by title and users by username. It is case-sensitive.</p>
                        </div>
                        
                        <h2 className="mt-4 mb-4">Analytics</h2>
                        <CardTable cols={3} renderItem={this.renderAnalyticsCard} data={data}/>
                    </div>
                </div>

            </div>
        );
    }
}

export default Admin;
