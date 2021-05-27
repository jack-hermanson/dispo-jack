import React from "react";
import {PageHeader} from "../../Utils/PageHeader";
import {Button, Col, Row} from "reactstrap";
import {AdminTabs} from "../../Admin/AdminTabs";
import {AgnosticLink} from "../../Utils/AgnosticLink";

export const AdminStrains: React.FC = () => {
    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="Manage Strains">
                        <AgnosticLink
                            className="btn btn-primary"
                            linkType="internal"
                            path="/admin/strains/new"
                            linkText="New"
                        />
                    </PageHeader>
                </Col>
            </Row>
        </React.Fragment>
    );
}
