import React from "react";
import {ListGroup, ListGroupItem} from "reactstrap";
import {KeyValPair} from "jack-hermanson-ts-utils";
import {AgnosticLink} from "./AgnosticLink";

interface Props {
    flush?: boolean;
    keyValPairs: KeyValPair[];
    className?: string;
    children?: React.ReactNode;
}

export const KeyValListGroup: React.FC<Props> = ({flush = false, keyValPairs, className, children}: Props) => {
    return (
        <ListGroup className={className} flush={flush}>
            {keyValPairs.map((kvp, index) => {
                const pt0 = index === 0 && flush;
                const pb0 = (keyValPairs.length - 1 === index) && flush;
                const classes = `${flush && "px-0"} ${pt0 && "pt-0"} ${pb0 && "pb-0"}`;
                return (
                    <ListGroupItem key={kvp.key} className={classes}>
                        <strong>{kvp.key}</strong>: {kvp.url ? (
                        <AgnosticLink
                            linkText={kvp.val as string}
                            linkType={kvp.url.linkType}
                            path={kvp.url.path}
                            className="dotted-link" />
                        ) : kvp.val}
                    </ListGroupItem>
                );
            })}
            {children}
        </ListGroup>
    );
}
