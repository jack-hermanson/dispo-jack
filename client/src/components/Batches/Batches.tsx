import React from "react";
import {Col, Row} from "reactstrap";
import {PageHeader} from "../Utils/PageHeader";
import {AdminTabs} from "../Admin/AdminTabs";

export const Batches: React.FC = () => {
    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="Manage Batches" borderBottom />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Batches</p>
                </Col>
            </Row>
        </React.Fragment>
    );
}