import React from 'react';
import {Table} from 'react-bootstrap';
import dummyEvents from "../../static/dummyEvents";
import dummyUsers from "../../static/dummyUsers";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import CardTable from "./CardTable";
import Header from "../shared/Header";
import Pagination from "react-bootstrap/Pagination";

class Admin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            searchMode: "Event",
            page: 1,
            searching: false,
        }
    }

    componentDidMount() {
        this.setState({data: [
                {title: "Users Online",  figure: "1"},
                {title: "Total Users",  figure: "4"},
                {title: "Beacons Placed",  figure: "1"},
                {title: "Private Beacons",  figure: "1"},
                {title: "Public Beacons",  figure: "0"},
            ]})
    }

    renderAnalyticsCard = (item) => {
        return (
          <React.Fragment>
              <h6>{item.title}</h6>
              <span>{item.figure}</span>
          </React.Fragment>
        );
    };

    render() {
        const { data, searchMode, page, searching} = this.state;

        return (
            <div>
                <div>
                    <Header/>
                </div>
                <div className="h-100 w-100">
                    <div className="w-75 mr-auto ml-auto">
                        <div className="w-100 text-center">
                            <h1 className="mt-2">Admin Dashboard</h1>
                        </div>
                        <h2 className="mt-4 mb-4">Live Feed</h2>
                        <Table bordered hover>
                            <thead>
                            <tr>
                                <th>Event</th>
                                <th colSpan="2">Data</th>
                                <th>Id</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>New User</td>
                                <td colSpan={2}>{dummyUsers[0].firstName + " " + dummyUsers[0].lastName}</td>
                                <td>2h38hr3h1</td>
                            </tr>
                            <tr>
                                <td>New Event</td>
                                <td colSpan={2}>{dummyEvents[0].title}</td>
                                <td>zh5ufrxx1</td>
                            </tr>
                            <tr>
                                <td>New Event</td>
                                <td colSpan={2}>{dummyEvents[0].title}</td>
                                <td>f53cbn3oi</td>
                            </tr>
                            </tbody>
                        </Table>

                        <div className="mr-auto ml-auto">
                                <Pagination>
                                <Pagination.Item onClick={() => this.setState({page: 1})} key={1} active={page === 1}>
                                    {1}
                                </Pagination.Item>
                                <Pagination.Item onClick={() => this.setState({page: 2})} key={2} active={page === 2}>
                                    {2}
                                </Pagination.Item>
                                <Pagination.Item onClick={() => this.setState({page: 3})} key={3} active={page === 3}>
                                    {3}
                                </Pagination.Item>
                                <Pagination.Item onClick={() => this.setState({page: 4})} key={4} active={page === 4}>
                                    {4}
                                </Pagination.Item>
                            </Pagination>
                        </div>

                        <h2 className="mt-3 mb-4">Search</h2>
                        <div className="w-100 text-center">
                            <span className="mt-3">
                                <h5 className="d-inline-block mr-2" >Search for a:</h5>
                                <ButtonGroup aria-label="type" className="border-0">
                                    <Button className={searchMode === "Event" ? "bg-primary" : "bg-white text-primary"} onClick={() => {this.setState({searchMode: "Event"})}}>Event</Button>
                                    <Button className={searchMode === "Event" ? "bg-white text-primary" : "bg-primary"} onClick={() => {this.setState({searchMode: "Profile"})}}>Profile</Button>
                                </ButtonGroup>
                            </span>
                        </div>
                        <div style={{width: 400}} className="mr-auto ml-auto">
                            <Form className="ml-auto mr-auto mt-4">
                                <Form.Group className="mb-0">
                                    <Form.Control onFocus={() => this.setState({searching: true})}
                                                  onBlur={() => this.setState({searching: false})}
                                                  type="email"
                                                  placeholder="Enter Search" />
                                </Form.Group>
                            </Form>
                            {  searching &&
                                <div className="w-100 border" style={{height: 200}}>


                                </div>
                            }
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
