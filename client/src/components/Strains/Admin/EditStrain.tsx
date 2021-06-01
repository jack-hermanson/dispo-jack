import React, {useEffect} from "react";
import {StrainRecord} from "../../../data/strain";
import {AdminTabs} from "../../Admin/AdminTabs";
import {Col, Row} from "reactstrap";
import {PageHeader} from "../../Utils/PageHeader";
import {useStoreActions, useStoreState} from "../../../store";
import {useHistory} from "react-router-dom";
import {RouteComponentProps} from "react-router";

interface Props extends RouteComponentProps<{id: string}> {}

export const EditStrain: React.FC<Props> = ({match}: Props) => {
    const currentUser = useStoreState(state => state.currentUser);
    const strains = useStoreState(state => state.strains);
    const existingStrain = useStoreState(state => state.strains?.find(s => s.id === parseInt(match.params.id)));
    const history = useHistory();

    useEffect(() => {
        if (!currentUser || !currentUser.clearances.some(clearance => clearance >= 5)) {
            history.push("/account");
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
        </React.Fragment>
    )
}