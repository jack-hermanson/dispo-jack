import React, { useEffect } from "react";
import { StrainRequest } from "../../../data/strain";
import { AdminTabs } from "../../Admin/AdminTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "../../Utils/PageHeader";
import { useStoreActions, useStoreState } from "../../../store";
import { useHistory } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { CreateEditStrainForm } from "./CreateEditStrainForm";
import { LoadingSpinner } from "../../Utils/LoadingSpinner";

interface Props extends RouteComponentProps<{ id: string }> {}

export const EditStrain: React.FC<Props> = ({ match }: Props) => {
    const editStrain = useStoreActions(actions => actions.editStrain);
    const currentUser = useStoreState(state => state.currentUser);
    const existingStrain = useStoreState(state =>
        state.strains?.find(s => s.id === parseInt(match.params.id))
    );
    const history = useHistory();

    useEffect(() => {
        if (
            !currentUser ||
            !currentUser.clearances.some(clearance => clearance >= 5)
        ) {
            history.replace("/account");
        }
    }, [currentUser, history]);

    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="Edit Strain" />
                </Col>
            </Row>
            <Row>
                <Col>
                    {existingStrain ? (
                        <CreateEditStrainForm
                            onSubmit={submit}
                            submitBtnText="Save"
                            initialStrain={existingStrain}
                        />
                    ) : (
                        <LoadingSpinner />
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );

    async function submit(editedStrain: StrainRequest) {
        if (currentUser && existingStrain && currentUser.account.token) {
            try {
                await editStrain({
                    strain: editedStrain,
                    strainId: existingStrain.id,
                    token: currentUser.account.token,
                });
            } catch (error) {
                window.scrollTo(0, 0);
            }
        }
    }
};
