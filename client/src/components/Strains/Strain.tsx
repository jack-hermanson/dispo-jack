import React from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, CardImg} from "reactstrap";
import {getPriceKeyVals, StrainAndBatch} from "../../data/strain";
import {StrainTypeBadge} from "./StrainTypeBadge";
import {useStoreState} from "../../store";
import {FontAwesomeIcon as FA} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AgnosticLink} from "../Utils/AgnosticLink";
import {KeyValTable} from "../Utils/KeyValTable";
import {getPotencyKeyVals} from "../../data/batch";

interface Props {
    strainAndBatch: StrainAndBatch;
}

export const Strain: React.FC<Props> = ({strainAndBatch}: Props) => {
    const strainType = useStoreState(state => state.strainTypes)?.find(s => s.id === strainAndBatch.strain.strainTypeId)?.name;

    return (
        <Card className="mb-4">
            <CardHeader>
                <h5 className="mb-0">
                    <AgnosticLink className="me-2 dotted-link" linkType="internal" linkText={strainAndBatch.strain.name} path={`/strains/${strainAndBatch.strain.id}`} />
                    <StrainTypeBadge typeName={strainType || ""} /></h5>
            </CardHeader>
            <CardBody className="p-0">
                <CardImg className="p-3 strain-picture" src={strainAndBatch.batch.imageUrl} />
                <KeyValTable keyValPairs={[
                    ...getPotencyKeyVals(strainAndBatch.batch),
                    ...getPriceKeyVals(strainAndBatch.strain)
                ]} className="mb-0 card-table same-width" />
            </CardBody>
            <CardFooter className="py-3">
                <Button color="primary" size="sm" block><FA className="me-2" icon={faPlus} />Add to Cart</Button>
            </CardFooter>
        </Card>
    )
}
