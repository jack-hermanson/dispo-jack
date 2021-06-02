import React from "react";
import {Badge} from "reactstrap";

interface Props {
    typeName: string;
}

export const StrainTypeBadge: React.FC<Props> = ({typeName}: Props) => {
    return (
        <Badge color={
            typeName === "Indica" ? "info"
                : typeName === "Sativa" ? "danger"
                : typeName === "Hybrid" ? "primary"
                : typeName === "CBD" ? "success"
                : "secondary"
        }>{typeName}</Badge>
    )
}
