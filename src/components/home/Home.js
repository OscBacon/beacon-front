import React from 'react';
import '../../styles/Home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";
import { getEvents, addEvent } from "../../api/events"
import Map from './Map';


class Home extends React.Component {
  state = {
    events: [],
    showEvents: true,
    openNewEventForm: false,
    newEvent: {
      title: "",
      date: "",
      location: "",
      description: ""
    }
  }

  componentDidMount() {
    this.getAllEvents();
  }

  // API call to get all of the events for the side bar
  getAllEvents() {
    getEvents().then((events) => {
      this.setState({ events: events });
    });
  }

  getEventTable() {
    const { events } = this.state;
    const rows = [];
    let rowNum = 1;

    events.forEach((event) => {
      rows.push(
        <tr key={`row_${rowNum}`}>
          <td>{rowNum}</td>
          <td>
            <h3>
              <Link id='eventTitle' to='/event'>{event.title}</Link>
            </h3>
            <h5>{event.date}</h5>
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

  getMap() {
    return (
      <Image src={require('../../static/homePageMap.png')} thumbnail />
    );
  }

  getNewEventForm() {
    return (
      <div>
        <Row>
          <TextField
            label="Title"
            margin="normal"
            variant="filled"
            onInput={this.inputEventTitle}
          />
        </Row>
        <Row>
          <TextField
            label="Date"
            margin="normal"
            variant="filled"
            onInput={this.inputEventDate}
          />
        </Row>
        <Row>
          <TextField
            label="Location"
            margin="normal"
            variant="filled"
            onInput={this.inputEventLocation}
          />
        </Row>
        <Row>
          <TextField
            label="Description"
            margin="normal"
            variant="filled"
            onInput={this.inputEventDescription}
          />
        </Row>
        <Row>
          <Button>Upload Image</Button>
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
    const { newEvent } = this.state;
    addEvent({ ...newEvent }).then(status => console.log(status));
    this.getAllEvents();
    this.setState({ openNewEventForm: false });
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

  inputEventLocation = (event) => {
    const { newEvent } = this.state;
    newEvent.location = event.target.value;
    this.setState({ newEvent });
  }

  render() {
    const { showEvents, openNewEventForm } = this.state;
    return (
      <div>
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
        <Container>
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
                {/* {this.getMap()} */}
                <Map />
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
