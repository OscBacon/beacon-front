import React from 'react';
import '../../styles/Event.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
import { getEvent, updateEvent } from "../../api/events";
import { getCurrentUser, getUser } from "../../api/users";
import { getAttendingByEvent, addAttending, deleteAttending } from "../../api/attending"
import Dropzone from 'react-dropzone';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Geosuggest from 'react-geosuggest';

class Event extends React.Component {
  state = {
    event: {},
    openRsvpNotif: false,
    comment: '',
    attendees: [],
    discussions: [],
    rsvped: false,
    curr_user_attending_id: false,
    createdByCurrUser: false,

    showEditEvent: false,
    newEventTitle: "",
    newEventDate: "",
    newEventLocation: "",
    newEventDescription: "",
    newEventCoordinates: [],

    showEditPicture: false,
    picturePath: 'https://images.thestar.com/4gFaeXg3ePSLCMRhrwQyeBCLZ5U=/1086x748/smart/filters:cb(1569881885267)/https://www.thestar.com/content/dam/thestar/news/gta/2019/09/30/safety-barriers-installed-at-bahen-centre-after-student-death-u-of-t-says/rm_suicide_01.jpg',
    newPicturePath: '',
    newEventPicture: ''
  };

  componentDidMount() {
    this.getEvents();
  }

  async getEvents() {
    const id = this.props.match.params.id;
    const currUserId = (await getCurrentUser())._id;
    getEvent(id).then((event) => {
      this.setState({
        event: event,
        createdByCurrUser: currUserId === event.created_by,
        picturePath: event.image ? event.image : this.state.picturePath,
        newEventTitle: event.title,
        newEventDate: event.date,
        newEventLocation: event.location,
        newEventDescription: event.description,
        newEventCoordinates: event.coordinates,
      });
      this.getAttendents();
      this.getDiscussions();
    });
  }

  getEventTemplate() {
    const { event } = this.state;
  }

  async getAttendents() {
    const event_id = this.props.match.params.id;
    const attendings = []
    let rsvped = false;
    let curr_user_attending_id = null

    const current_user = await getCurrentUser();
    getAttendingByEvent(event_id).then((attendees) => {
      attendees.forEach((e) => {
        //fetch the user by their user_id
        getUser(e.user_id).then((user) => {
          attendings.push(
            <Col md={1}>
              <Image src={user.avatar} id="userProfileSmallPic" roundedCircle />
              <p>
                <Link id='userProfileName' to='/profile'>{user.user_name}</Link>
              </p>
            </Col>
          );
        });

        if (e.user_id == current_user._id) {
          rsvped = true;
          curr_user_attending_id = e._id;
        }

      });
      this.setState({ attendees: attendings, rsvped, curr_user_attending_id });
    });
  }

  getDiscussions() {
    const { event } = this.state;
    if (event.length == 0 || event == null) {
      return
    }

    const discussions = []
    event.comments.forEach((e) => {
      console.log("comment", e)
      getUser(e.user_id).then((user) => {
        discussions.push(
          <tr>
            <td>
              <Image src={user.avatar} id="userProfileSmallPic" roundedCircle />
              <p>
                <Link id='userProfileName' to={`/profile/${user._id}`}>{user.user_name}</Link>
              </p>
            </td>
            <td>
              <p>{e.comment}</p>
            </td>
          </tr>
        );
      });
      console.log(discussions)
      this.setState({ discussions })
    });
  }

  handleMarkRSVP = async (event) => {
    const { rsvped, curr_user_attending_id } = this.state;
    const event_id = this.props.match.params.id;
    // add the current user to the attendees table
    const curent_user = await getCurrentUser();
    if (curent_user) {
      const attendee = {
        user_id: curent_user._id,
        event_id: event_id
      };
      if (rsvped) {
        deleteAttending(curr_user_attending_id).then(this.getAttendents());
      } else {
        addAttending(attendee).then(this.getAttendents());
      }
    }
    else {
      console.log("session has expired")
    }
    this.setState({ openRsvpNotif: true });
  }

  handleRsvpClose = (event) => {
    this.setState({ openRsvpNotif: false });
  }

  handleChange = (event) => {
    this.setState({ comment: event.target.value })
  }

  handleCommentSubmit = () => {
    const { event, comment } = this.state;
    // get the current_user
    getCurrentUser().then((user) => {
      const new_comment = {
        user_id: user._id,
        comment: comment
      }
      event.comments.push(new_comment);
      updateEvent(event._id, event).then((status) => console.log(status));
      this.getEvents();
      this.getDiscussions();
    });
  }

  toggleEditEvent = () => {
    const { showEditEvent } = this.state;
    this.setState({ showEditEvent: !showEditEvent });
  };

  saveEditEvent = () => {
    const { event, newEventTitle, newEventDate, newEventLocation, newEventCoordinates, newEventDescription } = this.state;
    const new_event = {...event};
    new_event.title = newEventTitle;
    new_event.date = newEventDate;
    new_event.location = newEventLocation;
    new_event.coordinates = newEventCoordinates;
    new_event.description = newEventDescription;

    updateEvent(event._id, new_event).then(this.getEvents());
    this.setState({
      event: {...new_event},
      newEventTitle: null,
      newEventDate: null,
      newEventLocation: null,
      newEventCoordinates: null,
      newEventDescription: null
    });

    return this.toggleEditEvent();
  }

  cancelEditEvent = () => {
    const { event } = this.state;
    this.setState({
      newEventTitle: event.title,
      newEventDate: event.date,
      newEventLocation: event.location,
      newEventDescription: event.description,
      newEventCoordinates: event.coordinates,
    });

    return this.toggleEditEvent();
  };

  getEditEventModal = () => {
    const { showEditEvent, newEventTitle, newEventDate, newEventLocation, newEventCoordinates, newEventDescription } = this.state;

    return (
      <Modal show={showEditEvent} onHide={this.cancelEditEvent}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            label="Title"
            margin="normal"
            variant="filled"
            value={newEventTitle}
            onInput={(e) => this.setState({ newEventTitle: e.target.value})}
          />
          <TextField
            onInput={(e) => this.setState({ newEventDate: e.target.value })}
            label="Date"
            margin="normal"
            variant="filled"
            value={newEventDate}
          />
          <Geosuggest
            label="Location"
            className="MuiInputBase-root MuiFilledInput-root MuiFilledInput-underline MuiInputBase-formControl"
            inputClassName="MuiInputBase-input MuiFilledInput-input"
            onSuggestSelect={this.onLocationSelect}
            initialValue={newEventLocation}
          />
          <TextField
            onInput={(e) => this.setState({ newEventDescription: e.target.value })}
            label="Description"
            margin="normal"
            variant="filled"
            value={newEventDescription}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={this.cancelEditEvent}>
            Cancel
            </Button>
          <Button
            variant="primary"
            onClick={this.saveEditEvent}
            disabled={newEventTitle === '' | newEventDate === '' | newEventDescription}
          >
            Save Changes
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  toggleEditPicture = () => {
    const { showEditPicture } = this.state;
    this.setState({ showEditPicture: !showEditPicture });
  }

  saveEditPicture = () => {
    const { newPicturePath, event } = this.state;
    const new_event = { ...event };
    new_event.image = newPicturePath;

    updateEvent(event._id, new_event).then(this.getEvents());
    this.setState({
      picturePath: newPicturePath,
      newPicturePath: null,
      newEventPicture: null
    })
    return this.toggleEditPicture()
  };

  cancelEditPicture = () => {
    this.setState({
      newEventPicture: null,
      newPicturePath: null
    })

    return this.toggleEditPicture();
  }

  getNewEventPicture = () => {
    return (
      <Image src={this.state.newPicturePath} id='newEventPicture' thumbnail />
    );
  }

  getEditPictureModal = () => {
    const { showEditPicture, newEventPicture } = this.state;

    const handleDrop = (acceptedFiles) => {
      const reader = new FileReader();

      reader.readAsDataURL(acceptedFiles[0]);

      reader.addEventListener("load", () => {
        this.setState({
          newPicturePath: reader.result,
          newEventPicture: acceptedFiles[0]
        });
      });
    }

    return (
      <Modal show={showEditPicture} onHide={this.cancelEditPicture}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropzone
            onDrop={handleDrop}
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
          {newEventPicture && this.getNewEventPicture()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={this.cancelEditPicture}>
            Cancel
            </Button>
          <Button
            variant="primary"
            onClick={this.saveEditPicture}
            disabled={newEventPicture === null}
          >
            Save Changes
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  getEventPicture = () => {
    const { createdByCurrUser, picturePath } = this.state;

    if (createdByCurrUser) {
      return (
        <div id="eventPictureDiv">
          <div
            id='eventPictureHover'
            onClick={this.toggleEditPicture}
          >
            Edit Picture
                  </div>
          <Image id="eventPicture" src={picturePath} thumbnail />
        </div>
      )
    } else {
      return (
        <Image id="eventPicture" src={picturePath} thumbnail /> 
      )
    }
  }

  getRSVPButton = () => {
    const { rsvped } = this.state;
    return (
      <Button variant={rsvped ? "danger" : "primary"} onClick={this.handleMarkRSVP} >
        {rsvped ? "cancel rsvp" : "rsvp"}
      </Button>
    )
  }

  getEditEventButton = () => {
    return (
      <Button size='sm' variant='outline-primary' onClick={this.toggleEditEvent}><FontAwesomeIcon icon={faEdit} /> Edit Event</Button>
    )
  }

  onLocationSelect = (suggest) => {
    const { newEventLocation, newEventCoordinates } = this.state;
    newEventLocation = suggest.label;
    newEventCoordinates = [suggest.location.lng, suggest.location.lat];
  }

  render() {
    const { event, openRsvpNotif, attendees, discussions, rsvped, createdByCurrUser } = this.state;
    return (
      <div>
        <Modal show={openRsvpNotif} onHide={this.handleRsvpClose}>
          <Modal.Header closeButton>
            <Modal.Title>{rsvped? "We got your RSVP!": "Canceled your RSVP!"}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleRsvpClose}>
              Okay
              </Button>
          </Modal.Footer>
        </Modal>
        <Container>
          <Row>
            <Col sm={4}>
              <h4>{event.title}</h4>
            </Col>
            <Col>
              {createdByCurrUser ? this.getEditEventButton() : this.getRSVPButton()}
              
            </Col>
          </Row>
          <h5>{event.location}</h5>
          <Row>
            {this.getEventPicture()}
          </Row>
          <Row>
            <p>{event.description}</p>
          </Row>
          <Row>
            <h5>Attending</h5>
          </Row>
          <Row id="textAlignedCentre" >
            {attendees}
          </Row>
          <Row>
            <h5>Discussions</h5>
          </Row>
          <Row id="textAlignedCentre" >
            <div>
              <Table bordered hover>
                <tbody>
                  {discussions}
                </tbody>
              </Table>
            </div >
          </Row>
          <Row>
            <form onSubmit={this.handleSubmit}>
              <label>
                Comment:
                          <br></br>
                <textarea value={this.state.comment}
                  onChange={this.handleChange}
                  placeholder="Add Comment"></textarea>
              </label>
              <br></br>
              <Button onClick={this.handleCommentSubmit}>
                Add Comment
                      </Button>
            </form>
          </Row>
          {this.getEditEventModal()}
          {this.getEditPictureModal()}
        </Container>
      </div>

    )

  }
}

export default Event;
