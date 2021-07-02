import React, { useState } from "react";
import {
    ButtonDropdown,
    Card,
    CardBody,
    CardHeader,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from "reactstrap";
import { BatchRecord } from "../../data/batch";
import { useStoreState } from "../../store";
import { KeyValTable, LoadingSpinner } from "jack-hermanson-component-lib";
import { AgnosticLink } from "../Utils/AgnosticLink";
import { formatPercent } from "jack-hermanson-ts-utils";
import { useHistory } from "react-router-dom";

interface Props {
    batch: BatchRecord;
    showDetailsBtn?: boolean;
}

export const Batch: React.FC<Props> = ({
    batch,
    showDetailsBtn = true,
}: Props) => {
    const strain = useStoreState(state =>
        state.strains?.find(s => s.id === batch.strainId)
    );
    const [showActions, setShowActions] = useState(false);

    const history = useHistory();

    const dateReceived = new Date(batch.dateReceived);

    return (
        <React.Fragment>
            {strain ? (
                <Card className="mb-3">
                    <CardHeader className="d-flex align-items-center">
                        <h5 className="mb-0 me-auto">
                            {strain.name} - {dateReceived.toLocaleDateString()}
                        </h5>
                        {renderActionsDropdown()}
                    </CardHeader>
                    {renderCardBody()}
                </Card>
            ) : (
                <LoadingSpinner />
            )}
        </React.Fragment>
    );

    function renderActionsDropdown() {
        return (
            <ButtonDropdown
                isOpen={showActions}
                toggle={() => setShowActions(s => !s)}
            >
                <DropdownToggle size="sm" color="primary" caret>
                    Actions
                </DropdownToggle>
                <DropdownMenu end>
                    {showDetailsBtn && (
                        <DropdownItem
                            onClick={() => {
                                history.push(`/admin/batches/${batch.id}`);
                            }}
                        >
                            Details
                        </DropdownItem>
                    )}
                    <DropdownItem>Edit</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        );
    }

    function renderCardBody() {
        if (strain) {
            return (
                <CardBody className="p-0">
                    <KeyValTable
                        className="same-width card-table mb-0"
                        keyValPairs={[
                            { key: "ID Number", val: `${batch.id}` },
                            {
                                key: "Received",
                                val: `${dateReceived.toLocaleString()}`,
                            },
                            {
                                key: "Strain",
                                val: (
                                    <AgnosticLink
                                        linkType="internal"
                                        linkText={strain.name}
                                        path={`/admin/strains/edit/${strain.id}`}
                                    />
                                ),
                            },
                            {
                                key: "Image",
                                val: (
                                    <AgnosticLink
                                        linkType="external"
                                        linkText={
                                            `${batch.imageUrl?.slice(
                                                8,
                                                35
                                            )}...` || ""
                                        }
                                        path={batch.imageUrl || ""}
                                    />
                                ),
                            },
                            { key: "Size", val: `${batch.size} grams` },
                            {
                                key: "THC",
                                val: formatPercent(batch.thcPotency),
                            },
                            {
                                key: "CBD",
                                val: formatPercent(batch.cbdPotency),
                            },
                            { key: "Notes", val: batch.notes },
                        ]}
                    />
                </CardBody>
            );
        }
    }
};
