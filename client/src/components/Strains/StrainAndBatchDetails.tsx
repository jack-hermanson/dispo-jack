import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardImg,
} from "reactstrap";
import { AgnosticLink } from "../Utils/AgnosticLink";
import { StrainTypeBadge } from "./StrainTypeBadge";
import { KeyValTable } from "jack-hermanson-component-lib";
import { getPotencyKeyVals } from "../../../../shared/resource_models/batch";
import {
    getPriceKeyVals,
    StrainAndBatch,
} from "../../../../shared/resource_models/strain";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useStoreState } from "../../stores/_store";
import { AddToCartModal } from "../Cart/AddToCartModal";

interface Props {
    strainAndBatch: StrainAndBatch;
}

export const StrainAndBatchDetails: React.FC<Props> = ({
    strainAndBatch,
}: Props) => {
    const strainType = useStoreState(state =>
        state.strainTypes?.find(
            st => st.id === strainAndBatch.strain.strainTypeId
        )
    );

    const [showCartModal, setShowCartModal] = useState<boolean>(false);

    return (
        <React.Fragment>
            <Card className="mb-4">
                {renderCardHeader()}
                {renderCardBody()}
                {renderCardFooter()}
            </Card>
            <AddToCartModal
                isOpen={showCartModal}
                closeModal={() => {
                    setShowCartModal(false);
                }}
                strainAndBatch={strainAndBatch}
            />
        </React.Fragment>
    );

    function renderCardHeader() {
        return (
            <CardHeader>
                <h5 className="mb-0">
                    <AgnosticLink
                        className="me-2 dotted-link"
                        linkType="internal"
                        linkText={strainAndBatch.strain.name}
                        path={`/strains/${strainAndBatch.strain.id}`}
                    />
                    <StrainTypeBadge typeName={strainType?.name || ""} />
                </h5>
            </CardHeader>
        );
    }

    function renderCardBody() {
        return (
            <CardBody className="p-0">
                {strainAndBatch.batch.imageUrl && (
                    <CardImg
                        className="p-3 strain-picture"
                        src={strainAndBatch.batch.imageUrl}
                    />
                )}
                <KeyValTable
                    keyValPairs={[
                        ...getPotencyKeyVals(strainAndBatch.batch),
                        ...getPriceKeyVals(strainAndBatch.strain),
                    ]}
                    className="mb-0 card-table same-width"
                />
            </CardBody>
        );
    }

    function renderCardFooter() {
        return (
            <CardFooter className="py-3">
                <Button
                    color="primary"
                    size="sm"
                    block
                    onClick={() => {
                        setShowCartModal(true);
                    }}
                >
                    <FA className="me-2" icon={faPlus} />
                    Add to Cart
                </Button>
            </CardFooter>
        );
    }
};
