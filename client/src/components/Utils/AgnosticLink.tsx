import React, { Fragment } from "react";
import { Link } from "react-router-dom";

interface Props {
    linkType: "internal" | "external";
    linkText: string;
    path: string;
    className?: string;
}

export const AgnosticLink: React.FC<Props> = ({
    linkType,
    linkText,
    path,
    className,
}: Props) => {
    return (
        <Fragment>
            {linkType === "internal" ? (
                <Link to={path} className={className}>
                    {linkText}
                </Link>
            ) : (
                <a
                    href={path}
                    rel="noreferrer"
                    target="_blank"
                    className={className}
                >
                    {linkText}
                </a>
            )}
        </Fragment>
    );
};
