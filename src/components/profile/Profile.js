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
import { getUser, getCurrentUser, updateUser } from '../../api/users'
import { getAttendingByUser } from '../../api/attending'
import { Link } from "react-router-dom";
import { getUsersEvents } from '../../api/events';
import '../../styles/profile.css'
import ProfilePicture from '../shared/ProfilePicture';

class Profile extends React.Component {
  state = {
    user: null,
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    picturePath: null,
    editable: false,
    currentUser: null,

    newUsername: null,
    newFirstName: null,
    newLastName: null,
    newPicturePath: null,
    newProfilePicture: null,

    showEditProfile: false,
    showEditPicture: false,

    attendings: [],
    events: []
  };

  componentDidMount() {
    getCurrentUser().then((user) => {
      this.setState({currentUser: user}, this.getProfile)
    })
  }

  componentDidUpdate(prevProps){
    if(this.props.match.params.id !== prevProps.match.params.id){
      this.getProfile();
    }
  }
  
  async getProfile() {
    const user = await this.reloadUser();

    if(!user){
      this.props.history.push("/home");
    }

    this.setState(user, async () => {
      const events = await this.getUserEvents();
      const their_events = await this.getUsersOwnEvents();
      this.setState(Object.assign(events, their_events));
    })
  }

  async reloadUser(){
    let id = this.props.match.params.id;
    const {admin} = this.props;
    const {currentUser} = this.state;

    let editable = false
    if(id === "me"){
      id = currentUser._id;
    }
    if (id === currentUser._id || admin) {
      editable = true;
    }
    
    return getUser(id).then((user) => {
      return  {
        editable,
        user: user,
        id: user._id,
        username: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        picturePath: user.avatar,
        newUsername: user.user_name,
        newFirstName: user.first_name,
        newLastName: user.last_name,
      }
    }).catch((error) => {
      console.error(error.message);
    });
  }

  getUserEvents() {
    return getAttendingByUser(this.state.id).then((attendings) => {
      return {attendings}
    }).catch(error => {
      console.log("failed to fetch the attended events", error)
    });
  }

  getUsersOwnEvents() {
    return getUsersEvents(this.state.id).then((events) => {
      return {events}
    }).catch(error => {
      console.log("failed to fetch the events", error)
    });
  }

  getPastEvents() {
    const { attendings } = this.state;
    const pastEventTemplate = []
    attendings.forEach((attending, index) => {
      pastEventTemplate.push(
        <tr key={`event_${index}`}>
          <th>{(new Date(Date.parse(attending.event.date))).toLocaleString()}</th>
          <th>{<Link to={`/event/${attending.event._id}`}>{attending.event.title}</Link>}</th>
          <th>{attending.event.description}</th>
          <th> <Link id='currEvent' to={`/profile/${attending.event.created_by}`}>{attending.event.created_by}</Link></th>
        </tr>
      )
    })
    return pastEventTemplate
  }

  toggleEditProfile = () => {
    const { showEditProfile } = this.state;
    this.setState({ showEditProfile: !showEditProfile });
  };

  saveEditProfile = async () => {
    const { newUsername, newFirstName, newLastName, user } = this.state;
    const new_user = { ...user };
    new_user.user_name = newUsername;
    new_user.first_name = newFirstName;
    new_user.last_name = newLastName;
    await updateUser(user._id, new_user);
    const reloaded = await this.reloadUser();
    this.setState(reloaded, this.toggleEditProfile);
  }

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
    const { newPicturePath, id, user } = this.state;
    const new_user = { ...user };
    new_user.avatar = newPicturePath

    updateUser(id, new_user).then((result) => {
      this.reloadUser().then((reloaded) => {
        this.setState(
          Object.assign(reloaded, {
            newPicturePath: null,
            newProfilePicture: null
          }), this.toggleEditPicture)  
      })
    });
  };

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


  getEditProfileButton() {
    return (
      <Button size='sm' variant='outline-primary' onClick={this.toggleEditProfile}><FontAwesomeIcon icon={faEdit} /> Edit Profile</Button>
    )
  }

  getProfilePicture() {
    const { editable, picturePath } = this.state;
    if (editable) {
      return (
        <div id='profilePictureDiv'>
          <div
            id='profilePictureHover'
            onClick={this.toggleEditPicture}
          >
            Edit Picture
                    </div>
        <ProfilePicture src={picturePath} id="profilePicture"/>
        </div>
      )
    } else {
      return (
        <ProfilePicture src={picturePath} id="profilePicture"/>
      )
    }
  }


  render() {
    const { editable, username, firstName, lastName, picturePath, events } = this.state;
    return (
      <div>
        <Container>
          <Row>
            <Col xs={3} id='profile-info'>
              {this.getProfilePicture()}
              <h2><FontAwesomeIcon icon={faUser} /> {username}</h2>
              {editable && this.getEditProfileButton()}
            </Col>
            <Col>
              <h1>{firstName} {lastName}</h1>
              <div>
                {editable ? "My Current Events" : "Current Events:"}
              </div>
              {
                events.map((event, index) => 
                  <div key={`event_${index}`}>
                     <Link id='currEvent' to={`/event/${event._id}`}>{event.title}</Link>
                  </div>
                )
              }
            </Col>
          </Row>
          <Row>
            <Col>
              <h1>Attending Events</h1>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Host</th>
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
