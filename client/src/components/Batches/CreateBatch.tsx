import React from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { CreateEditBatchForm } from "./CreateEditBatchForm";
import { AdminTabs } from "../Admin/AdminTabs";

export const CreateBatch: React.FC = () => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <AdminTabs />
                </Col>
            </Row>
            <Row>
                <Col>
                    <PageHeader title="New Batch" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CreateEditBatchForm />
                </Col>
            </Row>
        </React.Fragment>
    );
};
