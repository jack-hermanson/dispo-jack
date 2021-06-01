import React from "react";
import {Button, Card, CardBody, CardHeader} from "reactstrap";
import {getPriceKeyVals, StrainRecord} from "../../../data/strain";
import {KeyValTable} from "../../Utils/KeyValTable";
import {useStoreState} from "../../../store";
import {LoadingSpinner} from "../../Utils/LoadingSpinner";
import {StrainTypeBadge} from "../StrainTypeBadge";
import {AgnosticLink} from "../../Utils/AgnosticLink";

interface Props {
    strain: StrainRecord;
}

export const AdminStrain: React.FC<Props> = ({strain}: Props) => {
    const strainType = useStoreState(state => state.strainTypes)?.find(st => st.id === strain.strainTypeId);
    const strainBatches = useStoreState(state => state.batches)?.filter(b => b.strainId === strain.id);

    return (
        <Card className="mb-3 no-mb-last">
            <CardHeader className="d-flex align-items-center">
                <h5 className="mb-0 me-auto">{strain.name}</h5>
                <Button size="sm" color="primary">Test</Button>
            </CardHeader>
            {renderCardBody()}
        </Card>
    );

    function renderCardBody() {
        return (
            <React.Fragment>
                {strainType ? (
                    <CardBody className="p-0">
                        <KeyValTable className="table-striped card-table same-width mb-0" keyValPairs={[
                            {key: "Strain Type", val: <StrainTypeBadge typeName={strainType.name} />},
                            ...getPriceKeyVals(strain),
                            {key: "Batches", val: strainBatches?.length}
                        ]} />
                    </CardBody>
                ) : <LoadingSpinner />}
            </React.Fragment>
        );
    }
}