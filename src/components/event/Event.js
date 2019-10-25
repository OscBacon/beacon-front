import React from 'react';
import '../../styles/Event.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import dummyEvents from '../../static/dummyEvents';

class Event extends React.Component {
  state = {
    event: [],
    mock_data: [
      { name: 'Amir', comment: 'Excited to be there!', profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/62357713_2486535374699741_4082721466909458432_n.jpg?_nc_cat=110&_nc_oc=AQntc7psN0850o8haE0EtEBxY2C9iSfug6M6oiroGSPLLdvkzyw1CSQsxnlOvqHQ5Ws&_nc_ht=scontent-yyz1-1.xx&oh=607a0e7e4f6d30eb7ad87d77685723cc&oe=5E6572C1' },
      { name: 'Sulagshan', comment: 'Lets go team 38.', profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/69856555_10156137121612691_2505740614054707200_n.jpg?_nc_cat=101&_nc_oc=AQn0rYKBQPag1PKZYV90uP7zHB7S8bgT2etQI6OE2PaoA7ILLBMybw1i5Zc6ll21bbM&_nc_ht=scontent-yyz1-1.xx&oh=fa6b1db99512f73aa9f373e4d071e7dc&oe=5E167A55' }
    ],
    comment: 'Enter your comment'
  }

  componentDidMount() {
    this.getEvents();
  }

  // Replace with the actual ajax
  getEvents() {
    this.setState({ event: dummyEvents[0] });
  }

  getEventTemplate() {
    const { event } = this.state;
  }

  getAttendents() {
    // to be replace with the api call
    const mock_data = [
      { name: 'Guarav', profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/68898708_2189507831342607_6433033510943981568_n.jpg?_nc_cat=103&_nc_oc=AQnYyiEsKynRjNft4HuzJRTcujWvJGkayoevIbNYXgAJv2ROo-c8CIEp60Ld3J4TtVA&_nc_ht=scontent-yyz1-1.xx&oh=03563ac992b13bbbfe9ac9fdfee0b313&oe=5E61F562' },
      { name: 'Oscar', profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t31.0-8/22291300_1697193586980572_7979689183599898674_o.jpg?_nc_cat=107&_nc_oc=AQlG9a1L6fSDrN7eEnTrYVj8Y-SVE9c22fg7EvXIk1ElIYflPn0pTzqWngpQe6wpZcI&_nc_ht=scontent-yyz1-1.xx&oh=62d82c1a0a12e1b559b3d91346a8c428&oe=5E5BC4EF' },
      { name: 'Amir', profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/62357713_2486535374699741_4082721466909458432_n.jpg?_nc_cat=110&_nc_oc=AQntc7psN0850o8haE0EtEBxY2C9iSfug6M6oiroGSPLLdvkzyw1CSQsxnlOvqHQ5Ws&_nc_ht=scontent-yyz1-1.xx&oh=607a0e7e4f6d30eb7ad87d77685723cc&oe=5E6572C1' },
      { name: 'Sulagshan', profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/69856555_10156137121612691_2505740614054707200_n.jpg?_nc_cat=101&_nc_oc=AQn0rYKBQPag1PKZYV90uP7zHB7S8bgT2etQI6OE2PaoA7ILLBMybw1i5Zc6ll21bbM&_nc_ht=scontent-yyz1-1.xx&oh=fa6b1db99512f73aa9f373e4d071e7dc&oe=5E167A55' }
    ]
    const attendings = []

    mock_data.forEach((e) => {
      attendings.push(
        <Col md={1}>
          <Image src={e.profilePic} id="userProfileSmallPic" roundedCircle />
          <p>
            <a id='userProfileName' href='/profile'>{e.name}</a>
          </p>
        </Col>
      );
    })

    return attendings
  }

  getDiscussions() {
    // replace with actual api to retrieve the event discussions
    const discussions = []

    this.state.mock_data.forEach((e) => {
      discussions.push(
        <tr>
          <td>
            <Image src={e.profilePic} id="userProfileSmallPic" roundedCircle />
            <p>
              <a id='userProfileName' href='/profile'>{e.name}</a>
            </p>
          </td>
          <td>
            <p>{e.comment}</p>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Table bordered hover>
          <tbody>
            {discussions}
          </tbody>
        </Table>
      </div >
    );
  }

  addComment(comment) {
    //send comment to data base


  }

  handleChange = (event) => {
    this.setState({comment: event.target.value})
  }

  handleSubmit = (event) => {
    //add to mock data in actuality want ot submit to database of coments for this event
    alert('An essay was submitted: ' + this.state.comment);
    // const newComment = { name: 'Amir', comment: this.state.comment, profilePic: 'https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/62357713_2486535374699741_4082721466909458432_n.jpg?_nc_cat=110&_nc_oc=AQntc7psN0850o8haE0EtEBxY2C9iSfug6M6oiroGSPLLdvkzyw1CSQsxnlOvqHQ5Ws&_nc_ht=scontent-yyz1-1.xx&oh=607a0e7e4f6d30eb7ad87d77685723cc&oe=5E6572C1' };
    // this.setState((state, props) => {
    //   this.state.mock_data.push(newComment);
    // });
    event.preventDefault();
  }

  render() {
    const { event } = this.state;
    return (
      <Container>
        <Row>
          <Col sm={4}>
            <h4>{event.title}</h4>
          </Col>
          <Col>
            <Button>
              rsvp
            </Button>
          </Col>
        </Row>
        <br></br>
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
          {this.getAttendents()}
        </Row>
        <Row>
          <h5>Discussions</h5>
        </Row>
        <Row id="textAlignedCentre" >
          {this.getDiscussions()}
        </Row>
        <Row>
        <form onSubmit={this.handleSubmit}>
          <label>
            Comment:
            <br></br>
            <textarea value={this.state.comment} onChange={this.handleChange} />
          </label>
          <br></br>
          <Button type="submit">
            Add Comment
          </Button>
        </form>
        </Row>
      </Container>
    )

  }
}

export default Event;
