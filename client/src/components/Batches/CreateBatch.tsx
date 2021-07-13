import React from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { CreateEditBatchForm } from "./CreateEditBatchForm";
import { AdminTabs } from "../Admin/AdminTabs";
import { useMinClearance } from "../../utils/useMinClearance";

export const CreateBatch: React.FC = () => {
    useMinClearance(5);

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
                <Col>{renderForm()}</Col>
            </Row>
        </React.Fragment>
    );

    function renderForm() {
        return <CreateEditBatchForm onSubmit={batch => console.log(batch)} />;
    }
};
