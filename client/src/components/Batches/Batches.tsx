import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { AdminTabs } from "../Admin/AdminTabs";
import { useStoreState } from "../../store";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import { useHistory } from "react-router-dom";
import { Batch } from "./Batch";

export const Batches: React.FC = () => {
    const batches = useStoreState(state => state.batches);
    const currentUser = useStoreState(state => state.currentUser);

    const history = useHistory();

    useEffect(() => {
        if (
            !currentUser ||
            !currentUser.clearances.some(clearance => clearance >= 5)
        ) {
            history.replace("/account");
        }
    }, [history, currentUser]);

    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="Manage Batches" />
                </Col>
            </Row>
            <Row>
                <Col>
                    {batches ? (
                        batches.map(batch => (
                            <Batch batch={batch} key={batch.id}>
                                {batch.strainId}
                            </Batch>
                        ))
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );
};
