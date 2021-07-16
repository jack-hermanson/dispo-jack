import React, { useCallback, useState } from "react";
import {
    ButtonDropdown,
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
} from "reactstrap";
import { NavLink, useHistory } from "react-router-dom";
import {
    faCannabis,
    faHome,
    faUserCircle,
    faBong,
    faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { useStoreActions, useStoreState } from "../../stores/_store";

export const Navigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggle = () => setIsOpen(!isOpen);
    const history = useHistory();
    const account = useStoreState(state => state.currentUser?.account);
    const [userBtnOpen, setUserBtnOpen] = useState(false);
    const logOut = useStoreActions(actions => actions.logOut);

    const closeNav = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <Navbar dark className="mb-4 main-navbar px-0" expand="lg">
            <Container>
                <NavbarBrand
                    className="hover-mouse"
                    onClick={() => history.push("/")}
                >
                    <FA icon={faBong} /> DispoJack
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar style={{ marginRight: "auto" }}>
                        <NavItem>
                            <NavLink
                                exact
                                className="nav-link"
                                to="/"
                                onClick={closeNav}
                            >
                                <FA icon={faHome} /> Home
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={closeNav}
                                className="nav-link"
                                to="/strains"
                            >
                                <FA icon={faCannabis} /> Strains
                            </NavLink>
                        </NavItem>
                        {renderAdmin()}
                    </Nav>
                    <Nav navbar style={{ marginLeft: "auto" }}>
                        <NavItem>{renderUser()}</NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );

    function renderUserIcon() {
        return <FA className="me-1" icon={faUserCircle} />;
    }

    function renderUser() {
        return (
            <NavLink
                className="nav-link py-0 pe-0 mt-2 mt-lg-0"
                to="/account"
                onClick={e => {
                    if (account) {
                        e.preventDefault();
                    }
                }}
            >
                {account ? (
                    <ButtonDropdown
                        isOpen={userBtnOpen}
                        toggle={() => setUserBtnOpen(open => !open)}
                    >
                        <DropdownToggle size="sm" color="secondary" caret>
                            {renderUserIcon()}
                            {account.username}
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem
                                onClick={() => {
                                    history.push("/account");
                                    closeNav();
                                }}
                            >
                                My Account
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem
                                onClick={async () => {
                                    await logOut(account.token!);
                                    history.push("/account");
                                    closeNav();
                                }}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                ) : (
                    <span>{renderUserIcon()} Account</span>
                )}
            </NavLink>
        );
    }

    function renderAdmin() {
        if (account)
            return (
                <NavItem>
                    <NavLink
                        className="nav-link"
                        to="/admin"
                        onClick={closeNav}
                    >
                        <FA icon={faTools} /> Admin
                    </NavLink>
                </NavItem>
            );
    }
};
