import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import {addUser, login, getCurrentUser} from "../../api/users";
import '../../styles/login.css';
import Alert from "react-bootstrap/Alert";

class Login extends React.Component {
  state = {
    signUp: false,
    isAdmin: false,
    isAuthenticated: false,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    username: null,
    loading: false,
    error: null,
  }

  async componentDidMount(){
    try{
      const currUser = await getCurrentUser();
      this.props.history.push("/home");
    }
    catch(e){
      console.log(e.message);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { email, password, firstName, lastName, username, signUp} = this.state;
    this.setState({loading: true});

    if(!signUp){ //logging in
      this.authenticate();
    }
    else{ //signing up
      addUser({
        email: email,
        password: password,
        user_name: username,
        first_name: firstName,
        last_name: lastName,
      }).then((data) => {
        if(data.error){
          return this.setState({loading: false, error: data.error})
        }
        this.authenticate();
      })
    }
  };

  authenticate = () => {
    const { email, password } = this.state;

    login(email, password).then((data) => {
      const newState = {loading: false};
      console.log(data);
      if(data.error){
        newState.error = data.error;
        return this.setState(newState);
      }
      this.setState(newState, () => {
        this.props.history.push('/home');
      });

    }).catch((error) => {
      this.setState({error: error.message});
    })
  };

  handleClick = () => {
    this.setState(prevState => ({
      signUp: !prevState.signUp
    }));
  }

  handleInputChange = (event, input) => {
    this.setState({ [input]: event.target.value, error: null });
  }

  getLogInForm() {
    return (
      <Fragment>
        <h2>Log In</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control placeholder='Enter email' onChange={(e) => this.handleInputChange(e, "email")} />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' onChange={(e) => this.handleInputChange(e, "password")} />
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
              <Form.Control type='text' placeholder='Adam' onChange={(e) => this.handleInputChange(e, "firstName")} />
            </Form.Group>

            <Form.Group as={Col} controlId='formLastName'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type='text' placeholder='Smith' onChange={(e) => this.handleInputChange(e, "lastName")} />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId='formUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' placeholder='adamsmith9'  onChange={(e) => this.handleInputChange(e, "username")} />
          </Form.Group>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type='email' placeholder='adam@utoronto.ca'  onChange={(e) => this.handleInputChange(e, "email")} />
          </Form.Group>

          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='password' onChange={(e) => this.handleInputChange(e, "password")} />
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
    const {loading, error} = this.state;

    return (
      <Fragment>
        <Row noGutters>
          <Col></Col>
          <Col id='form-col' md={5}>
            {error && <Alert variant="danger">
             {error}
            </Alert>}
            <Card id='form'>
              <div>
                <h1 className="d-inline-block mr-2">Beacon</h1>
                {loading && <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>}
              </div>
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
