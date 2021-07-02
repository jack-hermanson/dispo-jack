import React from "react";
import { PageHeader } from "../Utils/PageHeader";
import { Col, Row } from "reactstrap";
import { LoginForm } from "./LoginForm";

export const LoginPage: React.FC = () => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="Account" />
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <LoginForm />
                </Col>
            </Row>
        </React.Fragment>
    );
};
