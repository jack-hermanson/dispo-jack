import React from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { CreateEditBatchForm } from "./CreateEditBatchForm";
import { AdminTabs } from "../Admin/AdminTabs";
import { useMinClearance } from "../../utils/useMinClearance";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { useHistory } from "react-router-dom";
import { scrollToTop } from "jack-hermanson-ts-utils";

export const CreateBatch: React.FC = () => {
    useMinClearance(5);

    const history = useHistory();

    const saveBatch = useStoreActions(actions => actions.saveBatch);
    const currentUser = useStoreState(state => state.currentUser);

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
        return (
            <CreateEditBatchForm
                onSubmit={async batchRequest => {
                    if (currentUser?.account.token) {
                        try {
                            await saveBatch({
                                batchRequest,
                                token: currentUser.account.token,
                            });
                            history.push("/admin/batches");
                        } catch (error) {
                            console.error(error);
                            scrollToTop();
                        }
                    }
                }}
            />
        );
    }
};
