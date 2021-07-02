import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { PageHeader } from "../Utils/PageHeader";
import { LoadingSpinner } from "jack-hermanson-component-lib";
import { AdminTabs } from "../Admin/AdminTabs";
import { Batch } from "./Batch";

interface Props extends RouteComponentProps<{ id: string }> {}

export const BatchDetails: React.FC<Props> = ({ match }: Props) => {
    const batch = useStoreState(state =>
        state.batches?.find(b => b.id === parseInt(match.params.id))
    );
    const currentUser = useStoreState(state => state.currentUser);

    const history = useHistory();

    useEffect(() => {
        if (!currentUser?.clearances.some(c => c >= 5)) {
            history.replace("/account");
        }
    }, [history, currentUser]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <AdminTabs />
                </Col>
            </Row>
            <Row>
                <Col>
                    <PageHeader title="Batch Details" borderBottom />
                </Col>
            </Row>
            {batch ? (
                <React.Fragment>
                    <Row>
                        <Col>
                            <Batch batch={batch} showDetailsBtn={false} />
                        </Col>
                    </Row>
                </React.Fragment>
            ) : (
                <LoadingSpinner />
            )}
        </React.Fragment>
    );
};
