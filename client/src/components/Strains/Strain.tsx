import React from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, CardImg} from "reactstrap";
import {StrainRecord} from "../../data/strain";
import {StrainTypeBadge} from "./StrainTypeBadge";
import {useStoreState} from "../../store";
import {StrainPrices} from "./StrainPrices";
import {FontAwesomeIcon as FA} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AgnosticLink} from "../Utils/AgnosticLink";

interface Props {
    strain: StrainRecord;
}

export const Strain: React.FC<Props> = ({strain}: Props) => {
    const strainType = useStoreState(state => state.strainTypes)?.find(s => s.id === strain.strainTypeId)?.name;

    return (
        <Card className="mb-4">
            <CardHeader>
                <h5 className="mb-0">
                    <AgnosticLink className="me-2 dotted-link" linkType="internal" linkText={strain.name} path={`/strains/${strain.id}`} />
                    <StrainTypeBadge typeName={strainType || ""} /></h5>
            </CardHeader>
            <CardBody className="p-0">
                <CardImg className="p-3" src="https://leafly-cms-production.imgix.net/wp-content/uploads/2017/02/01113652/kush-1024x640.jpg" />
                <StrainPrices className="mb-0 card-table same-width" strain={strain} />
            </CardBody>
            <CardFooter>
                <Button color="primary" size="sm" block><FA className="me-2" icon={faPlus} />Add to Cart</Button>
            </CardFooter>
        </Card>
    )
}
