import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faEdit } from '@fortawesome/free-solid-svg-icons';
import TextField from '@material-ui/core/TextField';

import '../../styles/profile.css';
import dummyUsers from '../../static/dummyUsers.js';
import Header from "../shared/Header";

class Profile extends React.Component {
  state = {
    username: null,
    firstName: null,
    lastName: null,

    newUsername: null,
    newFirstName: null,
    newLastName: null,
    newProfilePicture: null,

    showEditProfile: false,

    currentEvent: 'Krispy Kreme Donut Sale',
    pastEvents: [
      {
        date: 1571531434750,
        title: 'CSC309 Study Session',
        description: 'A study session for CSC309'
      },
      {
        date: 1551331434750,
        title: 'Lorem Ipsum',
        description: 'A filler event'
      }
    ]
  }

  componentDidMount() {
    this.getProfile();
  }

  // TODO: API call to get data about a user's profile
  getProfile() {
    this.setState({
      username: dummyUsers[0].username,
      firstName: dummyUsers[0].firstName,
      lastName: dummyUsers[0].lastName,
      newUsername: dummyUsers[0].username,
      newFirstName: dummyUsers[0].firstName,
      newLastName: dummyUsers[0].lastName,
     })

     // TODO: Check if this is the current user's profile page
     if (true) {
       this.setState({ me: true})
     }
  }

  toggleEditProfile = () => {
    const { showEditProfile } = this.state;
    this.setState({ showEditProfile: !showEditProfile });
  }

  saveEditProfile = () => {
    const { newUsername, newFirstName, newLastName } = this.state;

    // TODO: API Call to update user
    this.setState({
      username: newUsername,
      firstName: newFirstName,
      lastName: newLastName
    })

    return this.toggleEditProfile();
  }

  cancelEditProfile = () => {
    const { username, firstName, lastName } = this.state;
    this.setState({
      newUsername: username,
      newFirstName: firstName,
      newLastName: lastName
    })

    return this.toggleEditProfile();
  }

  getEditProfileModal = () => {
      const { showEditProfile, newUsername, newFirstName, newLastName, newProfilePicture } = this.state;

    return (
      <Modal show={showEditProfile} onHide={this.cancelEditProfile}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={{ span: 6, offset: 3}}>
              <TextField 
                onInput={(e) => this.setState({ newUsername: e.target.value})}
                value={newUsername} 
                variant='filled'
                margin='normal'
                label='Username'
                error={newUsername  === ''}
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 6, offset: 3}}>
              <TextField 
                onInput={(e) => this.setState({ newFirstName: e.target.value})}
                value={newFirstName} 
                variant='filled'
                margin='normal'
                label='First Name'
                error={newFirstName  === ''}
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 6, offset: 3}}>
              <TextField 
                onInput={(e) => this.setState({ newLastName: e.target.value})}
                value={newLastName} 
                variant='filled'
                margin='normal'
                label='Last Name'
                error={newLastName  === ''}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={this.cancelEditProfile}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={this.saveEditProfile}
            disabled={newUsername === '' | newFirstName === '' | newLastName === ''}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  getAddFriendButton() {
    return (
      <Button size='sm' variant='outline-primary'><FontAwesomeIcon icon={faPlus} /> Add Friend</Button>
    );
  }

  getEditProfileButton() {
    return (
      <Button size='sm' variant='outline-primary' onClick={this.toggleEditProfile}><FontAwesomeIcon icon={faEdit} /> Edit Profile</Button>
    )
  }



  render() {
      const { me, username, firstName, lastName, currentEvent, pastEvents } = this.state;

    return (
      <div>
        <Container>
          <Row>
            <Col xs={3} id='profile-info'>
              <div>
                <Image src='https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-1/p160x160/62357713_2486535374699741_4082721466909458432_n.jpg?_nc_cat=110&_nc_oc=AQnzKrIBP2CZlC42tG23jPnCM0o0bdIyvuyyH4Ngotnq-wlwix0cU_ttaRq6oSIfugg&_nc_ht=scontent-yyz1-1.xx&oh=524fe57b6cd9f19183887c60713bcb1e&oe=5E2BD0FA' id='profile-photo' roundedCircle />
              </div>
              <h2><FontAwesomeIcon icon={faUser} /> {username}</h2>
              {me ? this.getEditProfileButton() : this.getAddFriendButton()}
            </Col>
            <Col>
              <h1>{firstName} {lastName}</h1>
              <p>
                Current Event: <a id='currEvent' href='/event'>{currentEvent}</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h1>History</h1>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEvents.map((event, idx) => {
                    return (
                      <tr>
                        <th>{new Date(event.date).toLocaleDateString()}</th>
                        <th>{event.title}</th>
                        <th>{event.description}</th>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          {this.getEditProfileModal()}
        </Container>
      </div>
    );
  }
}

export default Profile;
