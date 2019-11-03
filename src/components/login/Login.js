import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import '../../styles/login.css';

class Login extends React.Component {
  state = {
    //remove the mock_data states later!
    users_mock_data: [
      { email: "user", password: "user" },
      { email: "admin", password: "admin" }
    ],
    admins_mock_data: ["admin"],
    signUp: false,
    isAdmin: false,
    isAuthenticated: false,
    email: null,
    password: null
  }

  handleSubmit = () => {
    const { email, password } = this.state;
    const isAuthenticated = this.authenticateUser(email, password);
    const isAdmin = this.isAdmin(email);

    // set the global variable for authentication and admin permissions -- should be replaced by cookies later!
    window.isAuth = isAuthenticated;
    window.isAdmin = isAdmin;
    this.props.history.push('/');
  }

  authenticateUser(email, password) {
    // replace later with API call to database to get user info
    const { users_mock_data } = this.state;
    for (let data of users_mock_data) {
      if (data.email === email) {
        if (data.password === password) { return true }
        else { return false }
      }
    }

    return false;
  }

  isAdmin(user) {
    // replace with api call later to get all the admins
    const { admins_mock_data } = this.state;
    for (let admin of admins_mock_data) {
      if (admin === user) { return true }
    }

    return false;
  }

  handleClick = () => {
    this.setState(prevState => ({
      signUp: !prevState.signUp
    }));
  }

  handleInputEmail = (event) => {
    this.setState({ email: event.target.value });
  }

  handleInputPassword = (event) => {
    this.setState({ password: event.target.value });
  }

  getLogInForm() {
    return (
      <Fragment>
        <h2>Log In</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control placeholder='Enter email' onChange={this.handleInputEmail} />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' onChange={this.handleInputPassword} />
          </Form.Group>
          <Form.Group controlId='formBasicCheckbox'>
            <Form.Check type='checkbox' label='Remember password' />
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='primary' type='submit'>Log In</Button>
            <Button variant='outline-primary' onClick={this.handleClick}>Sign Up</Button>
          </div>
        </Form>
      </Fragment>
    );
  }

  getSignUpForm() {
    return (
      <Fragment>
        <h2>Sign Up</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId='formFirstName'>
              <Form.Label>First Name</Form.Label>
              <Form.Control type='text' placeholder='Adam' />
            </Form.Group>

            <Form.Group as={Col} controlId='formLastName'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type='text' placeholder='Smith' />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type='email' placeholder='adam@utoronto.ca' />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='password' />
          </Form.Group>
          <Form.Group controlId='formBasicCheckbox'>
            <Form.Check type='checkbox' label='Remember password' />
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='primary' type='submit'>Sign Up</Button>
            <Button variant='outline-primary' onClick={this.handleClick}>Log In</Button>
          </div>
        </Form>
      </Fragment>
    );
  }

  render() {
    const signUp = this.state.signUp;

    return (
      <Fragment>
        <Row noGutters>
          <Col></Col>
          <Col id='form-col' md={5}>
            <Card id='form'>
              <h1>Beacon</h1>
              {signUp ? this.getSignUpForm() : this.getLogInForm()}
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Fragment>
    );
  }
}

export default Login;