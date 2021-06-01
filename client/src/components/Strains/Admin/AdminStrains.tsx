import React from "react";
import {PageHeader} from "../../Utils/PageHeader";
import {Button, Col, Row} from "reactstrap";
import {AdminTabs} from "../../Admin/AdminTabs";
import {AgnosticLink} from "../../Utils/AgnosticLink";
import {useStoreState} from "../../../store";
import {AdminStrain} from "./AdminStrain";
import {LoadingSpinner} from "../../Utils/LoadingSpinner";

export const AdminStrains: React.FC = () => {
    const strains = useStoreState(state => state.strains);

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
            <Row>
                <Col>
                    {strains ? (
                        strains.map(strain => <AdminStrain key={strain.id} strain={strain} />)
                    ) : <LoadingSpinner />}
                </Col>
            </Row>
        </React.Fragment>
    );
}
