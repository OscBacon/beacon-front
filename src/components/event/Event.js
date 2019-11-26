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
import { getAttendingByEvent, addAttending } from "../../api/attending"

class Event extends React.Component {
  state = {
    event: [],
    openRsvpNotif: false,
    comment: '',
    attendees: [],
    discussions: [],
    rsvped: false
  };

  componentDidMount() {
    this.getEvents();
  }

  getEvents() {
    const id = this.props.match.params.id;
    getEvent(id).then((event) => {
      console.log(event);
      this.setState({ event: event });
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

    const curren_user = await getCurrentUser();
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

        if (e.user_id == curren_user._id) {
          rsvped = true;
        }

      });
      this.setState({ attendees: attendings, rsvped });
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
    const event_id = this.props.match.params.id;
    // add the current user to the attendees table
    const curent_user = await getCurrentUser();
    if (curent_user) {
      const attendee = {
        user_id: curent_user._id,
        event_id: event_id
      };
      addAttending(attendee);
    }
    else {
      console.log("session has expired")
    }
    // update the attendee list
    this.getAttendents();
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

  render() {
    const { event, openRsvpNotif, attendees, discussions, rsvped } = this.state;
    return (
      <div>
        <Modal show={openRsvpNotif} onHide={this.handleRsvpClose}>
          <Modal.Header closeButton>
            <Modal.Title>We got your RSVP!</Modal.Title>
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
              <Button onClick={this.handleMarkRSVP} disabled={rsvped}>
              {rsvped ? "rsvped" : "rsvp"}
              </Button>
            </Col>
          </Row>
          <h5>{event.location}</h5>
          <Row>
            <Image id="eventPhoto" src='https://images.thestar.com/4gFaeXg3ePSLCMRhrwQyeBCLZ5U=/1086x748/smart/filters:cb(1569881885267)/https://www.thestar.com/content/dam/thestar/news/gta/2019/09/30/safety-barriers-installed-at-bahen-centre-after-student-death-u-of-t-says/rm_suicide_01.jpg' thumbnail />
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
        </Container>
      </div>

    )

  }
}

export default Event;
