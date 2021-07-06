import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useStoreActions, useStoreState } from "../../../stores/_store";
import { CreateEditStrainForm } from "./CreateEditStrainForm";
import { PageHeader } from "jack-hermanson-component-lib";
import { useHistory } from "react-router-dom";
import { StrainRequest } from "../../../../../shared/resource_models/strain";
import { AdminTabs } from "../../Admin/AdminTabs";

export const CreateStrain: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const addStrain = useStoreActions(actions => actions.addStrain);
    const history = useHistory();

    useEffect(() => {
        if (
            !currentUser ||
            !currentUser.clearances.some(clearance => clearance >= 5)
        ) {
            history.replace("/account");
        }
    });

    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="New Strain" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CreateEditStrainForm
                        onSubmit={newStrain => submitForm(newStrain)}
                        submitBtnText="Create"
                    />
                </Col>
            </Row>
        </React.Fragment>
    );

    async function submitForm(newStrain: StrainRequest) {
        if (currentUser && currentUser.account.token) {
            try {
                await addStrain({
                    strain: newStrain,
                    token: currentUser.account.token,
                });
            } catch (error) {
                window.scrollTo(0, 0);
            }
        }
    }
};
