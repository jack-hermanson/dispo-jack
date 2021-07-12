import React, { useEffect } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { LoginForm } from "./LoginForm";
import { useHistory } from "react-router-dom";

export const LoginPage: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        history.replace("/");
    }, [history]);

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
