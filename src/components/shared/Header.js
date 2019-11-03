import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar bg="light" expand="lg" className="mb-3">
                <Navbar.Brand> <Link className="clear-link" to="/home"> Beacon </Link> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto mr-3">
                        {window.isAdmin &&
                        <Link to={"/admin"}>
                            <Button>
                                Admin
                            </Button>
                        </Link>
                        }
                    </Nav>
                    <Nav>
                        <Link to="/profile">
                            <Image
                                src={"https://scontent-yyz1-1.xx.fbcdn.net/v/t1.0-9/62357713_2486535374699741_4082721466909458432_n.jpg?_nc_cat=110&_nc_oc=AQntc7psN0850o8haE0EtEBxY2C9iSfug6M6oiroGSPLLdvkzyw1CSQsxnlOvqHQ5Ws&_nc_ht=scontent-yyz1-1.xx&oh=607a0e7e4f6d30eb7ad87d77685723cc&oe=5E6572C1"} id="userProfileSmallPic" roundedCircle
                            />
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
