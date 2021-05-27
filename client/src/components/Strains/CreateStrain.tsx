import React, {useEffect, useState} from "react";
import {Col, Row} from "reactstrap";
import {useStoreState} from "../../store";
import {CreateEditStrainForm} from "./CreateEditStrainForm";
import {PageHeader} from "../Utils/PageHeader";
import {useHistory} from "react-router-dom";


export const CreateStrain: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const history = useHistory();

    useEffect(() => {
        if (!currentUser || !currentUser.clearances.some(clearance => clearance >= 5)) {
            history.push("/account");
        }
    });

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="New Strain"/>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mb-3 mb-lg-0">
                    <CreateEditStrainForm
                        onSubmit={(event) => {
                            event.preventDefault();
                            console.log("submit");
                        }}
                        submitBtnText="Create"
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
}
