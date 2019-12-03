import React from 'react';
import {Table} from 'react-bootstrap';
import dummyEvents from "../../static/dummyEvents";
import dummyUsers from "../../static/dummyUsers";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import CardTable from "./CardTable";
import Header from "../shared/Header";
import Pagination from "react-bootstrap/Pagination";
import Image from "react-bootstrap/Image";

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
                <div className="h-100 w-100 text-center" style={{backgroundColor: "black"}}>
                    <h2 style={{color: "white"}}>unauthorized</h2>
                    <span><Image style={{width: 300, opacity: 0.8}} src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4d40b81f-d62c-4444-bbc2-df9a0ae7a5e4/dbnshyt-7f1843bd-2355-494d-9ad2-f25538c7b3e4.jpg/v1/fill/w_1600,h_2269,q_75,strp/lonely_astronaut__by_zary_cz_dbnshyt-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI2OSIsInBhdGgiOiJcL2ZcLzRkNDBiODFmLWQ2MmMtNDQ0NC1iYmMyLWRmOWEwYWU3YTVlNFwvZGJuc2h5dC03ZjE4NDNiZC0yMzU1LTQ5NGQtOWFkMi1mMjU1MzhjN2IzZTQuanBnIiwid2lkdGgiOiI8PTE2MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.cOTPPkB5kfLVdEB3mM22aMyuUGXV2eNlxetgBr_tEG8"/></span>     
                </div>
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

                        <h2 className="mt-4 mb-4">Analytics</h2>
                        <CardTable cols={3} renderItem={this.renderAnalyticsCard} data={data}/>
                    </div>
                </div>

            </div>
        );
    }
}

export default Admin;
