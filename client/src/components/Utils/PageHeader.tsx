import React from "react";

interface Props {
    title: string;
    className?: string;
    mb3?: boolean;
    borderBottom?: boolean;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({title, className, children, mb3 = true, borderBottom = true}: Props) => {
    return (
        <div className={`${mb3 && "mb-3"} ${borderBottom && "border-bottom"} ${children && "pb-2"} ${className}`}>
            <div className="page-title">
                <h2 className="title-text">{title}</h2>
                {children && (
                    <div className="actions-button">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
