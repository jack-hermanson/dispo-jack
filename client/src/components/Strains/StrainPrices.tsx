import React from "react";
import {formatMoney} from "../../utils/functions";
import {KeyValTable} from "../Utils/KeyValTable";
import {StrainRecord} from "../../data/strain";

interface Props {
    strain: StrainRecord;
    className?: string;
}

export const StrainPrices: React.FC<Props> = ({strain, className}: Props) => {
    return (
        <KeyValTable className={`table-striped ${className}`} keyValPairs={[
            {key: "Ounce (28g) Price", val: formatMoney(strain.ouncePrice)},
            {key: "Quad (7g) Price", val: formatMoney(strain.quadPrice)},
            {key: "Eighth (3.5g) Price", val: formatMoney(strain.eighthPrice)},
            {key: "Gram (1g) Price", val: formatMoney(strain.gramPrice)},
        ]} />
    )
}
