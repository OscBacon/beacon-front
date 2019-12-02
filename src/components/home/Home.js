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
import Geosuggest from 'react-geosuggest';
import Dropzone from 'react-dropzone';

class Home extends React.Component {
  state = {
    events: [],
    showEvents: true,
    openNewEventForm: false,
    newEvent: {
      title: "",
      date: "",
      location: "",
      description: "",
      coordinates: [],
      image: null,
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
              <Link id='eventTitle' to={`/event/${event._id}`}>{event.title}</Link>
            </h3>
            <h5>{(new Date(Date.parse(event.date))).toLocaleString()}</h5>
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

  handleDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.readAsDataURL(acceptedFiles[0]);

    reader.addEventListener("load", () => {
      const { newEvent } = this.state;
      newEvent.image = reader.result;
      this.setState(newEvent);
    });
  }

  getNewEventPicture = () => {
    return (
      <Image src={this.state.newEvent.image} id='newEventPicture' thumbnail />
    );
  }

  getNewEventForm() {

    const { newEvent } = this.state;

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
            id="datetime-local"
            label="Date"
            type="datetime-local"
            defaultValue={(new Date(Date.now())).toISOString().slice(0, -8)}
            InputLabelProps={{
              shrink: true,
            }}
            onInput={this.inputEventDate}
          />
        </Row>
        <Row>
          <Geosuggest
            label="Location"
            className="MuiInputBase-root MuiFilledInput-root MuiFilledInput-underline MuiInputBase-formControl"
            inputClassName="MuiInputBase-input MuiFilledInput-input"
            onSuggestSelect={this.onLocationSelect}
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
          <Dropzone
            onDrop={this.handleDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <section id='dropzone'>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
          {newEvent.image && this.getNewEventPicture()}
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
    this.setState({
      openNewEventForm: false, newEvent: {
        title: "",
        date: "",
        location: "",
        description: "",
        coordinates: [],
        image: null,
      }
    });
  }

  handleNewEventSave = () => {
    const { newEvent } = this.state;
    console.log(newEvent)
    addEvent(newEvent).then(status => this.getAllEvents());
    this.handleNewEventClose();
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

  onLocationSelect = (suggest) => {
    const { newEvent } = this.state;
    if (suggest) {
      newEvent.location = suggest.label;
      newEvent.coordinates = [suggest.location.lng, suggest.location.lat];
    }
  }

  render() {
    const { showEvents, openNewEventForm, events } = this.state;

    return (
      <React.Fragment>
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
        <Container fluid>
          <Row>
            <Col sm={4}>
              <div style={{ overflowY: "scroll", height: "100vh" }}>
                <Button
                  onClick={this.handleEventToggle}
                >Show Events</Button>
                <div >
                  {showEvents && this.getEventTable()}
                </div>
              </div>
            </Col>
            <Col sm={8}>
              <Button
                className="createEventButton"
                variant="success"
                size="sm"
                onClick={this.handleAddNewEvent}
              >Add Event</Button>
              <div>
                <Map events={events} />
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default Home;
