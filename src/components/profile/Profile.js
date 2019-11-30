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
import { getUser, getCurrentUser } from '../../api/users'
import { getAttendingByUser } from '../../api/attending'
import { Link } from "react-router-dom";
import { getEvent } from '../../api/events';
import '../../styles/profile.css'

class Profile extends React.Component {
  state = {
    id: null,
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
    pastEvents: []
  };

  componentDidMount() {
    this.getProfile();

  }

  async getProfile() {
    const id = this.props.match.params.id;

    let userPromise;
    if (id === "me") {
      userPromise = getCurrentUser();
    } else {
      userPromise = getUser(id);
    }
    
    userPromise.then((user) => {
      this.setState({
        id: user._id,
        username: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        picturePath: user.avatar,
        newUsername: user.user_name,
        newFirstName: user.first_name,
        newLastName: user.last_name,
      });

      getCurrentUser().then(curr_user => {
        if (curr_user._id == user._id) {
          this.setState({ me: true })
        }
      });

      this.getUserEvents();
    });
  }

  getUserEvents() {
    const events = [];
    getAttendingByUser(this.state.id).then((attendings) => {
      attendings.forEach((attending) => {
        getEvent(attending.event_id).then(event => {
          events.push(event);
        });
      });
    this.setState({ pastEvents: events })
    }).catch(error => {
    console.log("failed to fetch the events", error)
  });
}

getPastEvents() {
  const { pastEvents } = this.state;
  const pastEventTemplate = []
  pastEvents.forEach((event) => {
    pastEventTemplate.push(
      <tr>
        <th>{event.date}</th>
        <th>{event.title}</th>
        <th>{event.description}</th>
      </tr>
    )
  })

  return pastEventTemplate
}

handleAddFriend() {

}

toggleEditProfile = () => {
  const { showEditProfile } = this.state;
  this.setState({ showEditProfile: !showEditProfile });
};

saveEditProfile = () => {
  const { newUsername, newFirstName, newLastName } = this.state;

  // TODO: API Call to update user;
  this.setState({
    username: newUsername,
    firstName: newFirstName,
    lastName: newLastName,
  });

  return this.toggleEditProfile();
};

cancelEditProfile = () => {
  const { username, firstName, lastName } = this.state;
  this.setState({
    newUsername: username,
    newFirstName: firstName,
    newLastName: lastName
  });

  return this.toggleEditProfile();
};

getEditProfileModal = () => {
  const { showEditProfile, newUsername, newFirstName, newLastName } = this.state;

  return (
    <Modal show={showEditProfile} onHide={this.cancelEditProfile}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TextField
          onInput={(e) => this.setState({ newUsername: e.target.value })}
          value={newUsername}
          variant='filled'
          margin='normal'
          label='Username'
          error={newUsername === ''}
        />
        <TextField
          onInput={(e) => this.setState({ newFirstName: e.target.value })}
          value={newFirstName}
          variant='filled'
          margin='normal'
          label='First Name'
          error={newFirstName === ''}
        />
        <TextField
          onInput={(e) => this.setState({ newLastName: e.target.value })}
          value={newLastName}
          variant='filled'
          margin='normal'
          label='Last Name'
          error={newLastName === ''}
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
    <Image src={this.state.newPicturePath} id='newProfilePicture' roundedCircle />
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
          {({ getRootProps, getInputProps }) => (
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
    <Button size='sm' variant='outline-primary'><FontAwesomeIcon icon={faPlus} /> Add Friend</Button>
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
              <Image src={picturePath} id='profilePicture' roundedCircle />
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
                {this.getPastEvents()}
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
