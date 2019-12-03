import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {logout, getCurrentUser} from "../../api/users";
import ProfilePicture from "./ProfilePicture";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    async componentDidMount() {
        const user = await getCurrentUser();
        this.setState({user});
    }

    onLogOut = () => {
        logout().then((data) => {
            this.props.history.push('/login');
        })
    };

    render() {
        const {user} = this.state;
        const {admin} = this.props;

        if(!user){
            return  <Navbar bg="light" expand="lg" className="mb-3"/>
        }

        return (
            <Navbar bg="light" expand="lg" className="mb-3">
                <Navbar.Brand> <Link className="clear-link" to="/home"> Beacon </Link> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto mr-3">
                        
                    </Nav>
                    <Nav className='align-items-center'>
                        {admin &&
                            <Link className="mr-2" to={"/admin"}>
                                <Button>
                                    Admin
                                </Button>
                            </Link>
                        }
                        {(user && !admin) &&
                            <h5 className="mb-0 mr-2"> Hello, {user.first_name} </h5>
                        }
                        <Button className="mr-3" onClick={this.onLogOut}>
                            Log Out
                        </Button>
                        <Link to="/profile/me">
                            <ProfilePicture
                                src={user.avatar} id="userProfileSmallPic" roundedCircle
                            />
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
