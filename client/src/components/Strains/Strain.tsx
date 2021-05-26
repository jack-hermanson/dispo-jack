import React from "react";
import {Card, CardHeader} from "reactstrap";
import {StrainTypeRecord} from "../../data/strain";

interface Props {
    strain: StrainTypeRecord;
}

export const Strain: React.FC<Props> = ({strain}: Props) => {
    return (
        <Card>
            <CardHeader>
                <h5 className="mb-0">{strain.name}</h5>
            </CardHeader>
        </Card>
    )
}
