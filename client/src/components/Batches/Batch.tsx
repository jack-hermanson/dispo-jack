import React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";
import {BatchRecord} from "../../data/batch";
import {useStoreState} from "../../store";
import {LoadingSpinner} from "../Utils/LoadingSpinner";
import {KeyValTable} from "../Utils/KeyValTable";
import {AgnosticLink} from "../Utils/AgnosticLink";
import {formatPercent} from "../../utils/functions";

interface Props {
    batch: BatchRecord;
}

export const Batch: React.FC<Props> = ({batch}: Props) => {

    const strain = useStoreState(state => state.strains?.find(s => s.id === batch.strainId));

    return (
        <React.Fragment>
            {strain ? (
                <Card className="mb-3">
                    <CardHeader>
                        <h5 className="mb-0">{strain.name}</h5>
                    </CardHeader>
                    <CardBody className="p-0">
                        <KeyValTable
                            className="same-width card-table mb-0"
                            keyValPairs={[
                                {key: "Date Received", val: `${new Date(batch.dateReceived).toLocaleString()}`},
                                {key: "Image", val: <AgnosticLink
                                        linkType="external"
                                        linkText={`${batch.imageUrl?.slice(8, 35)}...` || ""}
                                        path={batch.imageUrl || ""}
                                    />
                                },
                                {key: "Size", val: `${batch.size} grams`},
                                {key: "THC", val: formatPercent(batch.thcPotency)},
                                {key: "CBD", val: formatPercent(batch.cbdPotency)},
                                {key: "Notes", val: batch.notes}
                            ]}
                        />
                    </CardBody>
                </Card>
            ) : <LoadingSpinner />}
        </React.Fragment>
    );
}
