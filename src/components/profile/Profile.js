import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import '../../styles/profile.css';
import { default as dummyUsers } from '../../static/dummyUsers.js';
import Header from "../shared/Header";

class Profile extends React.Component {
    render() {
        this.username = dummyUsers[0].username;
        this.firstName = dummyUsers[0].firstName;
        this.lastName = dummyUsers[0].lastName;
        this.currentEvent = 'Krispy Kreme Donut Sale';
        this.pastEvents = [
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

        return (
            <div>
                <div>
                    <Header/>
                </div>
              <Container>
                <Row>
                  <Col xs={3} id='profile-info'>
                    <div>
                      <Image src='https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-1/p160x160/62357713_2486535374699741_4082721466909458432_n.jpg?_nc_cat=110&_nc_oc=AQnzKrIBP2CZlC42tG23jPnCM0o0bdIyvuyyH4Ngotnq-wlwix0cU_ttaRq6oSIfugg&_nc_ht=scontent-yyz1-1.xx&oh=524fe57b6cd9f19183887c60713bcb1e&oe=5E2BD0FA' id='profile-photo' roundedCircle />
                    </div>
                    <h2><FontAwesomeIcon icon={faUser}/> {this.username}</h2>
                    <Button size='sm' variant='outline-primary'><FontAwesomeIcon icon={faPlus}/> Add Friend</Button>
                  </Col>
                  <Col>
                    <h1>{this.firstName} {this.lastName}</h1>
                    <p>
                      Current Event: <a id='currEvent' href='/event'>{this.currentEvent}</a>
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
                        {this.pastEvents.map((event, idx) => {
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
              </Container>        
            </div>
        );
    }
}

export default Profile;
