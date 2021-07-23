import React, { useEffect } from "react";
import { useStoreState } from "../../stores/_store";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";

export const Register: React.FC = () => {
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
                <Col></Col>
            </Row>
        </React.Fragment>
    );
};
