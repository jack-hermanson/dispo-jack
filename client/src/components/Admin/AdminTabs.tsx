import React from "react";
import {Col, Nav, NavItem, Row} from "reactstrap";
import {NavLink, useHistory} from "react-router-dom";

export const AdminTabs: React.FC = () => {
    return (
        <Row>
            <Col>
                <Nav className="mb-2" tabs>
                    <NavItem>
                        <NavLink exact className="nav-link" to="/admin">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" to="/admin/strains">Strains</NavLink>
                    </NavItem>
                </Nav>
            </Col>
        </Row>

    );
}