import React from "react";

interface Props {
    title: string;
    className?: string;
    mb3?: boolean;
    borderBottom?: boolean;
}

export const PageHeader: React.FC<Props> = ({title, className, mb3 = true, borderBottom = true}: Props) => {
    return (
        <React.Fragment>
            <h2 className={`${mb3 && "mb-3"} ${borderBottom && "border-bottom"} ${className}`}>{title}</h2>
        </React.Fragment>
    );
}
