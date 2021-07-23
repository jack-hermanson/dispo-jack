import React, { useEffect } from "react";
import { useStoreState } from "../../stores/_store";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { RegisterForm } from "./RegisterForm";
import { AgnosticLink } from "../Utils/AgnosticLink";

export const RegisterPage: React.FC = () => {
    const history = useHistory();

    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (currentUser) {
            history.replace("/account");
        }
    }, [currentUser, history]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="Register" />
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <RegisterForm
                        onSubmit={async requestBody => {
                            console.log(requestBody);
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <hr className="mb-3 mt-4" />
                    <p>
                        Already have an account?{" "}
                        <AgnosticLink
                            linkType="internal"
                            linkText="Log in here."
                            path="/account/login"
                            className="text-white"
                        />
                    </p>
                </Col>
            </Row>
        </React.Fragment>
    );
};
