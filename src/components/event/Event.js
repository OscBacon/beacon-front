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
import {getComments, addComment} from '../../api/comments'
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
    currUser: {},

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
    this.fetch();
  }

  async fetch() {
    
    const currUser = await getCurrentUser();
    const user = {currUser};
    const event = await this.reloadEvent();
    
    this.setState(Object.assign(user, event), this.fetchRest)
  
  }

  async fetchRest() {
    console.log(this.getDiscussions());
    const discussions = await this.getDiscussions();
    const attending = await this.getAttendents();
    this.setState(Object.assign(discussions, attending));
  }
  
  async reloadEvent(){
    const id = this.props.match.params.id;
    const event = await getEvent(id);

    return {
      event: event,
      picturePath: event.image ? event.image : this.state.picturePath,
      newEventTitle: event.title,
      newEventDate: event.date,
      newEventLocation: event.location,
      newEventDescription: event.description,
      newEventCoordinates: event.coordinates,
    }
  }

  async getAttendents() {
    const {currUser} = this.state;
    const event_id = this.props.match.params.id;
    const attendings = []
    let rsvped = false;
    let curr_user_attending_id = null

    getAttendingByEvent(event_id).then((attendees) => {
      attendees.forEach((e, index) => {
        const user = e.user;

        if (user._id == currUser._id) {
          rsvped = true;
          curr_user_attending_id = e._id;
        }

      });
      return { attendees, rsvped, curr_user_attending_id };
    });
  }

  getDiscussions() {
    const { event } = this.state;

    return getComments(event._id).then((comments) => {
      return { discussions: comments };
    });
  }

  handleMarkRSVP = async (event) => {
    const { rsvped, curr_user_attending_id, currUser } = this.state;
    const event_id = this.props.match.params.id;
    // add the current user to the attendees table
    if (currUser) {
      const attendee = {
        user_id: currUser._id,
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
    const { event, comment, currUser } = this.state;
    // get the current_user
    const newComment = {
      text: comment
    }

    addComment(event._id, newComment).then((status) => {
      console.log(status)
      this.getDiscussions().then((discussions) => {
        console.log("UPDATED COMMENTS", discussions)
        this.setState(discussions)
      });
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

    updateEvent(event._id, new_event).then((result) => {
      this.reloadEvent().then((event) => {
        this.setState(event, this.toggleEditEvent)
      })
    });
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

    updateEvent(event._id, new_event).then(() => {
      this.reloadEvent().then((event) => {
        this.setState(Object.assign(
          {
          picturePath: newPicturePath,
          newPicturePath: null,
          newEventPicture: null
          },
          event,
        ), this.toggleEditPicture)
      })
    });
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
    const { currUser, picturePath, event } = this.state;

    if (currUser._id === event.created_by) { // created by current user
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
    const { event, openRsvpNotif, attendees, discussions, rsvped, currUser } = this.state;

    const createdByCurrUser = currUser._id === event.created_by;

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
          {      
            attendees.map((attending, index) => 
              <Col key={`attending_${index}`} md={1}>
                <Image src={attending.user.avatar} id="userProfileSmallPic" roundedCircle />
                <p>
                  <Link id='userProfileName' to='/profile'>{attending.user.user_name}</Link>
                </p>
              </Col>
            )
          }
          </Row>
          <Row>
            <h5>Discussions</h5>
          </Row>
          <Row id="textAlignedCentre" >
            <div>
              <Table bordered hover>
                <tbody>
                  {
                    discussions.map((comment, index) => 
                      <tr>
                        <td>
                          <Image src={comment.author.avatar} id="userProfileSmallPic" roundedCircle />
                          <p>
                            <Link id='userProfileName' to={`/profile/${comment.author._id}`}>{comment.author.user_name}</Link>
                          </p>
                        </td>
                        <td>
                          <p>{comment.text}</p>
                        </td>
                      </tr>
                    )
                  }
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
