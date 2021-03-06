import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { AdminTabs } from "../../Admin/AdminTabs";
import { AgnosticLink } from "../../Utils/AgnosticLink";
import { useStoreState } from "../../../stores/_store";
import { AdminStrain } from "./AdminStrain";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { StrainFilter } from "../Filter/StrainFilter";
import { StrainRecord } from "../../../../../shared/resource_models/strain";
import { useHistory } from "react-router-dom";

export const AdminStrains: React.FC = () => {
    const strains = useStoreState(state => state.strains);
    const currentUser = useStoreState(state => state.currentUser);

    const [filteredStrains, setFilteredStrains] = useState<
        StrainRecord[] | undefined
    >(undefined);

    const history = useHistory();

    useEffect(() => {
        if (
            !currentUser ||
            !currentUser.clearances.some(clearance => clearance >= 5)
        ) {
            history.replace("/account");
        }
        setFilteredStrains(strains);
    }, [setFilteredStrains, strains, currentUser, history]);

    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="Manage Strains">
                        <AgnosticLink
                            className="btn btn-primary btn-sm"
                            linkType="internal"
                            path="/admin/strains/new"
                            linkText="New"
                        />
                    </PageHeader>
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <div className="sticky-top mb-4 mb-lg-0">
                        <StrainFilter setFilteredStrains={setFilteredStrains} />
                    </div>
                </Col>
                <Col lg={9}>
                    {filteredStrains ? (
                        filteredStrains.map(strain => (
                            <AdminStrain key={strain.id} strain={strain} />
                        ))
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );
};
