import React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";
import {StrainRecord} from "../../../data/strain";

interface Props {
    strain: StrainRecord;
}

export const AdminStrain: React.FC<Props> = ({strain}: Props) => {
    return (
        <Card>
            <CardHeader>
                <h5 className="mb0">{strain.name}</h5>
            </CardHeader>
            <CardBody>

            </CardBody>
        </Card>
    )
}