import React from "react";
import {Table} from "reactstrap";
import {KeyValPair} from "../../utils/types";

interface Props {
    keyValPairs: KeyValPair[];
    className?: string;
}

export const KeyValTable: React.FC<Props> = ({keyValPairs, className}: Props) => {
    return (
        <Table className={className}>
            <tbody>
            {keyValPairs.map(kvp => (
                <tr key={kvp.key}>
                    <th>{kvp.key}</th>
                    <td>{kvp.val}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}
