import React from "react";
import { AdminTabs } from "../Admin/AdminTabs";
import { Col, Row } from "reactstrap";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";
import { RouteComponentProps } from "react-router";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { CreateEditBatchForm } from "./CreateEditBatchForm";
import { useMinClearance } from "../../utils/useMinClearance";
import { useHistory } from "react-router-dom";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditBatch: React.FC<Props> = ({ match }: Props) => {
    const currentUser = useStoreState(state => state.currentUser);
    const batch = useStoreState(state =>
        state.batches?.find(b => b.id === parseInt(match.params.id))
    );
    const updateBatch = useStoreActions(actions => actions.updateBatch);

    const history = useHistory();

    useMinClearance(5);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <AdminTabs />
                </Col>
            </Row>
            {batch ? (
                <React.Fragment>
                    <Row>
                        <Col>
                            <PageHeader title={`Edit Batch ${batch.id}`} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>{renderForm()}</Col>
                    </Row>
                </React.Fragment>
            ) : (
                <Row>
                    <Col>
                        <LoadingSpinner />
                    </Col>
                </Row>
            )}
        </React.Fragment>
    );

    function renderForm() {
        if (batch && currentUser?.account.token) {
            return (
                <CreateEditBatchForm
                    onSubmit={async batchRequest => {
                        try {
                            await updateBatch({
                                batchRequest,
                                id: parseInt(match.params.id),
                                token: currentUser.account.token!,
                            });
                            history.push(`/admin/batches/${match.params.id}`);
                        } catch (error) {
                            console.error(error);
                            scrollToTop();
                        }
                    }}
                    existingBatch={batch}
                />
            );
        } else {
            return <LoadingSpinner />;
        }
    }
};
