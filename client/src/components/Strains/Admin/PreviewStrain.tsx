import React from "react";
import {getPriceKeyVal, StrainRequest} from "../../../data/strain";
import {KeyValPair} from "../../../utils/types";
import {Card, CardBody, CardHeader, Col} from "reactstrap";
import {StrainTypeBadge} from "../StrainTypeBadge";
import {KeyValTable} from "../../Utils/KeyValTable";
import {useStoreState} from "../../../store";

interface Props {
    previewStrain: Partial<StrainRequest>;
}

export const PreviewStrain: React.FC<Props> = ({previewStrain}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);

    return (
        <React.Fragment>
            {renderPreview()}
        </React.Fragment>
    );

    function renderPreview() {
        if (Object.keys(previewStrain).length > 0) {
            const strainType =  strainTypes?.find(st => st.id === previewStrain.strainTypeId);

            const priceKeyVals: KeyValPair[] = [];
            if (previewStrain.ouncePrice) {
                priceKeyVals.push(getPriceKeyVal("Ounce", previewStrain.ouncePrice));
            }
            if (previewStrain.quadPrice) {
                priceKeyVals.push(getPriceKeyVal("Quad", previewStrain.quadPrice));
            }
            if (previewStrain.eighthPrice) {
                priceKeyVals.push(getPriceKeyVal("Eighth", previewStrain.eighthPrice));
            }
            if (previewStrain.gramPrice) {
                priceKeyVals.push(getPriceKeyVal("Gram", previewStrain.gramPrice));
            }

            return (
                <Card>
                    <CardHeader>
                        <h5 className="mb-0">
                            <span className="me-2">
                                {previewStrain.name}
                            </span>
                            {previewStrain.strainTypeId && (
                                <StrainTypeBadge typeName={
                                    strainType ? strainType.name : "N/A"
                                } />
                            )}
                        </h5>
                    </CardHeader>
                    <CardBody className="py-0 px-2">
                        <KeyValTable className="table-striped table-borderless mb-0" keyValPairs={priceKeyVals} />
                    </CardBody>
                </Card>
            );
        }
    }
}
