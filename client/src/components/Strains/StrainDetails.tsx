import React from "react";
import {RouteComponentProps} from "react-router";
import {Col, Row} from "reactstrap";
import {PageHeader} from "../Utils/PageHeader";
import {useStoreState} from "../../store";
import {LoadingSpinner} from "../Utils/LoadingSpinner";

interface Props extends RouteComponentProps<{id: string}> {}

export const StrainDetails: React.FC<Props> = ({match}: Props) => {
    const strain = useStoreState(state => state.strains?.find(s => s.id === parseInt(match.params.id)));

    return (
        <React.Fragment>
            {strain ? (
                <React.Fragment>
                    <Row>
                        <Col>
                            <PageHeader title={strain.name} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        </Col>
                    </Row>
                </React.Fragment>
            ) : <LoadingSpinner />}
        </React.Fragment>

    )
}
