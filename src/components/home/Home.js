import React from 'react';
import '../../styles/Home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import dummyEvents from '../../static/dummyEvents';
import TextField from '@material-ui/core/TextField';
import Header from "../shared/Header";
import {Link} from "react-router-dom";


class Home extends React.Component {
  state = {
    events: [],
    showEvents: true,
    openNewEventForm: false,
    newEvent: {
      title: "",
      date: "",
      description: ""
    }
  }

  componentDidMount() {
    this.getEvents();
  }

  // API call to get all of the events for the side bar
  getEvents() {
    this.setState({ events: dummyEvents });
  }

  getEventTable() {
    const { events } = this.state;
    const rows = [];
    let rowNum = 1;

    events.forEach((event) => {
      rows.push(
        <tr>
          <td>{rowNum}</td>
          <td>
            <h3>
              <Link id='eventTitle' to='/event'>{event.title}</Link>
            </h3>
            <h5>{this.convertTime(event.date)}</h5>
            <p>{event.description}</p>
          </td>
        </tr>
      )

      rowNum++;
    });

    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Events</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </div >
    );
  }

  convertTime(time_stamp) {
    const a = new Date(time_stamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  getMap() {
    return (
      <Image src={require('../../static/homePageMap.png')} thumbnail />
    );
  }

  getNewEventForm() {
    return (
      <div>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <TextField
              id="outlined-name"
              label="Title"
              margin="normal"
              variant="filled"
              onInput={this.inputEventTitle}
            />
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <TextField
              id="outlined-name"
              label="Date"
              margin="normal"
              variant="filled"
              onInput={this.inputEventDate}
            />
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>

            <TextField
              id="filled-full-width"
              label="Description"
              margin="normal"
              variant="filled"
              onInput={this.inputEventDescription}
            />
          </Col>
        </Row>
      </div>
    );
  }

  handleEventToggle = () => {
    const { showEvents } = this.state;
    this.setState({ showEvents: !showEvents });
  }
  handleAddNewEvent = () => {
    this.setState({ openNewEventForm: true });
  }

  handleNewEventClose = () => {
    this.setState({ openNewEventForm: false });
  }

  handleNewEventSave = () => {
    const { events, newEvent } = this.state;
    events.push({ ...newEvent });
    this.setState({ events });
  }

  inputEventTitle = (event) => {
    const { newEvent } = this.state;
    newEvent.title = event.target.value;
    this.setState({ newEvent });
  }

  inputEventDate = (event) => {
    const { newEvent } = this.state;
    newEvent.date = event.target.value;
    this.setState({ newEvent });
  }

  inputEventDescription = (event) => {
    const { newEvent } = this.state;
    newEvent.description = event.target.value;
    this.setState({ newEvent });
  }

  render() {
    const { showEvents, openNewEventForm } = this.state;

    return (
      <div>
        <Container>
          <Row>
            <Modal show={openNewEventForm} onHide={this.handleNewEventClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add a new event</Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.getNewEventForm()}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleNewEventClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleNewEventSave}>
                  Add
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
          <Row>
            <Col sm={4}>
              <div>
                <Button
                    onClick={this.handleEventToggle}
                >Show Events</Button>
                <div>
                  {showEvents && this.getEventTable()}
                </div>
              </div>
            </Col>
            <Col sm={8}>
              <Row>
                {this.getMap()}
              </Row>
                <Button
                    variant="success"
                    onClick={this.handleAddNewEvent}
                >Add Event</Button>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Home;
