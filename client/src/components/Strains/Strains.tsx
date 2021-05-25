import React from "react";
import {Col, Row} from "reactstrap";
import {PageHeader} from "../Utils/PageHeader";

export const Strains: React.FC = () => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="Strains" />
                </Col>
            </Row>
        </React.Fragment>
    );
}
