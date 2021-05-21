import React, {useState} from "react";
import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from "reactstrap";
import {NavLink, useHistory} from "react-router-dom";
import {faHome, faCannabis, faCode, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon as FA} from "@fortawesome/react-fontawesome";

export const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggle = () => setIsOpen(!isOpen);
    const history = useHistory();

    return (
        <Navbar dark className="mb-4 main-navbar px-0" expand="lg">
            <Container>
                <NavbarBrand className="hover-mouse" onClick={() => history.push("/")}>
                    <FA icon={faCannabis}/> DispoJack
                </NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar style={{marginRight: "auto"}}>
                        <NavItem>
                            <NavLink exact className="nav-link" to="/"><FA icon={faHome}/> Home</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav navbar style={{marginLeft: "auto"}}>
                        <NavItem>
                            <NavLink className="nav-link" to="/account"><FA icon={faUserCircle}/> Account</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
}
