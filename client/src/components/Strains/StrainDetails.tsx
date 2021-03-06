import React from "react";
import { RouteComponentProps } from "react-router";
import { Col, Row } from "reactstrap";
import { useStoreState } from "../../stores/_store";
import { getPriceKeyVals } from "../../../../shared/resource_models/strain";
import {
    KeyValTable,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib";

interface Props extends RouteComponentProps<{ id: string }> {}

export const StrainDetails: React.FC<Props> = ({ match }: Props) => {
    const strain = useStoreState(state =>
        state.strains?.find(s => s.id === parseInt(match.params.id))
    );
    const strainType = useStoreState(state =>
        state.strainTypes?.find(st => st.id === strain?.strainTypeId)
    );

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
                        <Col lg={6}>
                            <KeyValTable
                                className="table-striped"
                                keyValPairs={[
                                    { key: "Type", val: strainType?.name },
                                    ...getPriceKeyVals(strain),
                                ]}
                            />
                        </Col>
                    </Row>
                </React.Fragment>
            ) : (
                <LoadingSpinner />
            )}
        </React.Fragment>
    );
};
