import React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";
import {StrainRecord, StrainTypeRecord} from "../../data/strain";
import {KeyValListGroup} from "../Utils/KeyValListGroup";
import {StrainTypeBadge} from "./StrainTypeBadge";
import {useStoreState} from "../../store";

interface Props {
    strain: StrainRecord;
}

export const Strain: React.FC<Props> = ({strain}: Props) => {
    const strainType = useStoreState(state => state.strainTypes)?.find(s => s.id === strain.strainTypeId)?.name;

    return (
        <Card className="mb-4">
            <CardHeader>
                <h5 className="mb-0">{strain.name} <StrainTypeBadge typeName={strainType || ""} /></h5>
            </CardHeader>
            <CardBody>
                <KeyValListGroup flush keyValPairs={[
                    {key: "Ounce Price", val: `${strain.ouncePrice.toFixed(2)}`}
                ]} />
            </CardBody>
        </Card>
    )
}
