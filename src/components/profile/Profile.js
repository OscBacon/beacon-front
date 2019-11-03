import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faEdit, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import TextField from '@material-ui/core/TextField';
import Dropzone from 'react-dropzone';

import '../../styles/profile.css';
import dummyUsers from '../../static/dummyUsers.js';
import {Link} from "react-router-dom";

class Profile extends React.Component {
  state = {
    username: null,
    firstName: null,
    lastName: null,
    picturePath: null,

    newUsername: null,
    newFirstName: null,
    newLastName: null,
    newPicturePath: null,
    newProfilePicture: null,

    showEditProfile: false,
    showEditPicture: false,

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
      picturePath: dummyUsers[0].avatar,
      newUsername: dummyUsers[0].username,
      newFirstName: dummyUsers[0].firstName,
      newLastName: dummyUsers[0].lastName,
     })

     // TODO: Check if this is the current user's profile page
     if (true) {
       this.setState({ me: true})
     }
  }

  handleAddFriend() {

  }

  toggleEditProfile = () => {
    const { showEditProfile } = this.state;
    this.setState({ showEditProfile: !showEditProfile });
  }

  saveEditProfile = () => {
    const { newUsername, newFirstName, newLastName } = this.state;

    // TODO: API Call to update user;
    this.setState({
      username: newUsername,
      firstName: newFirstName,
      lastName: newLastName,
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
      const { showEditProfile, newUsername, newFirstName, newLastName } = this.state;

    return (
      <Modal show={showEditProfile} onHide={this.cancelEditProfile}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <TextField 
              onInput={(e) => this.setState({ newUsername: e.target.value})}
              value={newUsername} 
              variant='filled'
              margin='normal'
              label='Username'
              error={newUsername  === ''}
            />
            <TextField 
              onInput={(e) => this.setState({ newFirstName: e.target.value})}
              value={newFirstName} 
              variant='filled'
              margin='normal'
              label='First Name'
              error={newFirstName  === ''}
            />
            <TextField 
              onInput={(e) => this.setState({ newLastName: e.target.value})}
              value={newLastName} 
              variant='filled'
              margin='normal'
              label='Last Name'
              error={newLastName  === ''}
            />
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

  toggleEditPicture = () => {
    const { showEditPicture } = this.state;
    this.setState({ showEditPicture: !showEditPicture });
  }

  saveEditPicture = () => {
    const { newPicturePath } = this.state;

    // TODO: API Call to update user picture
    this.setState({
      picturePath: newPicturePath,
      newPicturePath: null,
      newProfilePicture: null
    })

    return this.toggleEditPicture();
  }

  cancelEditPicture = () => {
    this.setState({
      newProfilePicture: null,
      newPicturePath: null
    })

    return this.toggleEditPicture();
  }

  getNewProfilePicture = () => {
    return (
      <Image src={this.state.newPicturePath} id='newProfilePicture' roundedCircle/>
    );
  }

  getEditPictureModal = () => {
    const { showEditPicture, newProfilePicture } = this.state;

    const handleDrop = (acceptedFiles) => {
      const reader = new FileReader();

      reader.readAsDataURL(acceptedFiles[0]);

      reader.addEventListener("load", () => {
        this.setState({ 
          newPicturePath: reader.result,
          newProfilePicture: acceptedFiles[0]
        });
      });
    }

    return (
      <Modal show={showEditPicture} onHide={this.cancelEditPicture}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropzone 
            onDrop={handleDrop}
          >
            {({getRootProps, getInputProps}) => (
              <section id='dropzone'>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
          {newProfilePicture && this.getNewProfilePicture()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={this.cancelEditPicture}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={this.saveEditPicture}
            disabled={newProfilePicture === null}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  getAddFriendButton() {
    return (
      <Button size='sm' variant='outline-primary'><FontAwesomeIcon icon={faPlus}/> Add Friend</Button>
    );
  }

  getEditProfileButton() {
    return (
      <Button size='sm' variant='outline-primary' onClick={this.toggleEditProfile}><FontAwesomeIcon icon={faEdit} /> Edit Profile</Button>
    )
  }



  render() {
      const { me, username, firstName, lastName, picturePath, currentEvent, pastEvents } = this.state;

    return (
      <div>
        <Container>
          <Row>
            <Col xs={3} id='profile-info'>
              <div id='profilePictureDiv'>
                <div 
                  id='profilePictureHover'
                  onClick={this.toggleEditPicture}
                >
                  Edit Picture
                </div>
                <Image src={picturePath} id='profilePicture' roundedCircle/>
              </div>
              <h2><FontAwesomeIcon icon={faUser} /> {username}</h2>
              {me ? this.getEditProfileButton() : this.getAddFriendButton()}
            </Col>
            <Col>
              <h1>{firstName} {lastName}</h1>
              <p>
                Current Event: <Link id='currEvent' to='/event'>{currentEvent}</Link>
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
          {this.getEditPictureModal()}
        </Container>
      </div>
    );
  }
}

export default Profile;
