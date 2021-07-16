import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { BatchRecord } from "../../../../shared/resource_models/batch";
import { useStoreActions, useStoreState } from "../../stores/_store";
import {
    ActionsDropdown,
    ConfirmationModal,
    KeyValTable,
    LoadingSpinner,
} from "jack-hermanson-component-lib";
import { AgnosticLink } from "../Utils/AgnosticLink";
import {
    ClickDropdownAction,
    DropdownAction,
    formatPercent,
    LinkDropdownAction,
    scrollToTop,
} from "jack-hermanson-ts-utils";
import moment from "moment";

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
    const currentUser = useStoreState(state => state.currentUser);
    const deleteBatch = useStoreActions(actions => actions.deleteBatch);

    const dateReceived = new Date(batch.dateReceived);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            {renderDeleteModal()}
        </React.Fragment>
    );

    function renderActionsDropdown() {
        const options: Array<DropdownAction | undefined> = [];

        if (showDetailsBtn) {
            options.push(
                new LinkDropdownAction("Details", `/admin/batches/${batch.id}`)
            );
        }
        options.push(
            new LinkDropdownAction("Edit", `/admin/batches/edit/${batch.id}`)
        );
        options.push(undefined);
        options.push(
            new ClickDropdownAction("Delete", () => setShowDeleteModal(true))
        );

        return <ActionsDropdown options={options} size="sm" color="primary" />;
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
                                val: `${moment(batch.dateReceived).format(
                                    "dddd, MMMM Do, YYYY, LT"
                                )}`,
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
                                val: batch.imageUrl ? (
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
                                ) : (
                                    ""
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

    function renderDeleteModal() {
        return (
            <ConfirmationModal
                isOpen={showDeleteModal}
                setIsOpen={setShowDeleteModal}
                title="Confirm Batch Deletion"
                onConfirm={async () => {
                    if (currentUser?.account.token) {
                        try {
                            await deleteBatch({
                                id: batch.id,
                                token: currentUser.account.token,
                            });
                        } catch (error) {
                            console.error(error);
                            scrollToTop();
                        }
                        setShowDeleteModal(false);
                    }
                }}
                buttonColor="danger"
                buttonText="Delete"
            >
                Are you sure you want to delete this batch?
            </ConfirmationModal>
        );
    }
};
