import React from "react";
import {Card, CardBody, CardFooter, CardHeader, CardImg} from "reactstrap";
import {StrainRecord, StrainTypeRecord} from "../../data/strain";
import {StrainTypeBadge} from "./StrainTypeBadge";
import {useStoreState} from "../../store";
import {KeyValTable} from "../Utils/KeyValTable";
import {formatMoney} from "../../utils/functions";

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
            <CardBody className="p-0">
                <CardImg className="p-3" src="https://leafly-cms-production.imgix.net/wp-content/uploads/2017/02/01113652/kush-1024x640.jpg" />
                <KeyValTable className="mb-0 table-striped card-table same-width" keyValPairs={[
                    {key: "Ounce (28g) Price", val: formatMoney(strain.ouncePrice)},
                    {key: "Quad (7g) Price", val: formatMoney(strain.quadPrice)},
                    {key: "Eighth (3.5g) Price", val: formatMoney(strain.eighthPrice)},
                    {key: "Gram (1g) Price", val: formatMoney(strain.gramPrice)},
                ]} />
            </CardBody>
            <CardFooter>
                ok
            </CardFooter>
        </Card>
    )
}
