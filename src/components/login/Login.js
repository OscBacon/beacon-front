import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import '../../styles/login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {signUp: false};
  }

  handleSubmit() {
    this.props.history.push('/home');
  }

  handleClick() {
    this.setState(prevState => ({
      signUp: !prevState.signUp
    }));
  }

  render() {
    const signUp = this.state.signUp;
    let form;

    if (!signUp) {
      form = <LogInForm onSubmit={this.handleSubmit} onClick={this.handleClick}/>
    } else {
      form = <SignUpForm onSubmit={this.handleSubmit} onClick={this.handleClick}/>
    }

    return (
      <Fragment>
        <Row noGutters>
          <Col></Col>
          <Col id='form-col' md={5}>
            <Card id='form'>
              <h1>Beacon</h1>
              {form}
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Fragment>
    );
  }
}

function LogInForm(props) {
  return (
    <Fragment>
      <h2>Log In</h2>
      <Form onSubmit={props.onSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember password" />
        </Form.Group>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button variant="primary" type="submit">Log In</Button>
          <Button variant='outline-primary' onClick={props.onClick}>Sign Up</Button>
        </div>
      </Form>
    </Fragment>
  );
}

function SignUpForm(props) {
  return (
    <Fragment>
      <h2>Sign Up</h2>
      <Form onSubmit={props.onSubmit}>
        <Form.Row>
          <Form.Group as={Col} controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Adam" />
          </Form.Group>

          <Form.Group as={Col} controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Smith" />
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="adam@utoronto.ca" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder='password' />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember password" />
        </Form.Group>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button variant="primary" type="submit">Sign Up</Button>
          <Button variant='outline-primary' onClick={props.onClick}>Log In</Button>
        </div>
      </Form>
    </Fragment>
  );
}

export default Login;