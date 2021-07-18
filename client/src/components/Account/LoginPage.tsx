import React, { useEffect } from "react";
import { PageHeader } from "jack-hermanson-component-lib";
import { Col, Row } from "reactstrap";
import { LoginForm } from "./LoginForm";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../stores/_store";
import { AgnosticLink } from "../Utils/AgnosticLink";

export const LoginPage: React.FC = () => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (currentUser) {
            history.replace("/");
        }
    }, [history, currentUser]);

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
            <Row>
                <Col lg={6}>
                    <hr className="mb-4" />
                    <p>
                        Need an account?{" "}
                        <AgnosticLink
                            linkType="internal"
                            linkText="Register here."
                            path="/account/register"
                            className="text-white"
                        />
                    </p>
                </Col>
            </Row>
        </React.Fragment>
    );
};
