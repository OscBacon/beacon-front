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
import { getCurrentUser } from "../../api/users";
import { getAttendingByEvent, addAttending, deleteAttending } from "../../api/attending"
import {getComments, addComment} from '../../api/comments'
import Dropzone from 'react-dropzone';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Geosuggest from 'react-geosuggest';
import ProfilePicture from '../shared/ProfilePicture';

const defaultPicture = 'https://cdn.mindful.org/party.png?q=80&fm=jpg&fit=crop&w=1400&h=875';

class Event extends React.Component {
  state = {
    event: {},
    openRsvpNotif: false,
    comment: '',
    attendees: [],
    discussions: [],
    rsvped: false,
    currUser: {},
    editable: false,

    showEditEvent: false,
    newEventTitle: "",
    newEventDate: "",
    newEventLocation: "",
    newEventDescription: "",
    newEventCoordinates: [],

    showEditPicture: false,
    picturePath: defaultPicture,
    newPicturePath: '',
    newEventPicture: ''
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const {admin} = this.props;

    const currUser = await getCurrentUser();
    const user = {currUser};
    const event = await this.reloadEvent();

    const editable = (admin || (currUser._id === event.event.created_by._id))
    user.editable = editable;
    
    this.setState(Object.assign(user, event), this.fetchRest)
  
  }

  async fetchRest() {
    const discussions = await this.getDiscussions();
    const attending = await this.getAttendents();
    this.setState(Object.assign(discussions, attending));
  }
  
  async reloadEvent(){
    const id = this.props.match.params.id;
    const event = await getEvent(id);
    

    return {
      event: event,
      picturePath: event.image ? event.image : defaultPicture,
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

    return getAttendingByEvent(event_id).then((attendees) => {
      attendees.forEach((e, index) => {
        const user = e.user;
        if (user._id === currUser._id) {
          rsvped = true;
        }

      });
      return { attendees, rsvped };
    });
  }

  getDiscussions() {
    const { event } = this.state;

    return getComments(event._id).then((comments) => {
      return { discussions: comments };
    });
  }

  handleMarkRSVP = async (event) => {
    const { rsvped, currUser } = this.state;
    const event_id = this.props.match.params.id;
    // add the current user to the attendees table
    if (currUser) {
      if (rsvped) {
        await deleteAttending(currUser._id, event_id);
      } else {
        const attendee = {
          user: currUser._id,
          event: event_id
        };
        await addAttending(attendee);
      }
    }
    else {
      console.log("session has expired")
      return;
    }

    const newState = { openRsvpNotif: true, rsvped: !rsvped };
    const attendees = await this.getAttendents();
    console.log(attendees);
    this.setState(Object.assign(newState, attendees));
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
            id="datetime-local"
            onInput={(e) => this.setState({ newEventDate: e.target.value })}
            label="Date"
            margin="normal"
            variant="filled"
            type="datetime-local"
            value={newEventDate}
            InputLabelProps={{
              shrink: true,
            }}
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
    const { currUser, picturePath, event, editable} = this.state;

    if (editable) {
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
    if(suggest) {
      this.setState({
        newEventLocation: suggest.label,
        newEventCoordinates: [suggest.location.lng, suggest.location.lat]
      });
    }
  }

  render() {
    const { event, openRsvpNotif, attendees, discussions, rsvped, editable } = this.state;
    const {admin} = this.props;

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
              {editable ? this.getEditEventButton() : this.getRSVPButton()}
            </Col>
          </Row>
          <h5>{event.location}</h5>
          {event.created_by && 
            <div className="mt-2">
                <h5 className="d-inline-block mr-2">Host:</h5>
                <Link id='currEvent' to={`/profile/${event.created_by._id}`}>{event.created_by.user_name}</Link>
            </div>
          }
          <h5>{(new Date(Date.parse(event.date))).toLocaleString()}</h5>
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
                <ProfilePicture src={attending.user.avatar} id="userProfileSmallPic" />
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
              <Table bordered hover className="w-75">
                <tbody>
                  {
                    discussions.map((comment, index) => 
                      <tr key={`comment_${index}`} style={{borderColor: comment.author.user_name === "admin" ? "white" : "grey"}}>
                        <td>
                          <ProfilePicture src={comment.author.avatar} id="userProfileSmallPic"/>
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
