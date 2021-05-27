import React, {useEffect, useState} from "react";
import {Card, CardBody, CardFooter, CardHeader, Col, Row} from "reactstrap";
import {useStoreState} from "../../../store";
import {CreateEditStrainForm} from "./CreateEditStrainForm";
import {PageHeader} from "../../Utils/PageHeader";
import {useHistory} from "react-router-dom";
import {getPriceKeyVal, StrainRequest} from "../../../data/strain";
import {AdminTabs} from "../../Admin/AdminTabs";
import {StrainTypeBadge} from "../StrainTypeBadge";
import {KeyValPair} from "../../../utils/types";
import {KeyValTable} from "../../Utils/KeyValTable";


export const CreateStrain: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const strainTypes = useStoreState(state => state.strainTypes);
    const history = useHistory();
    const [previewStrain, setPreviewStrain] = useState<Partial<StrainRequest>>({});

    useEffect(() => {
        if (!currentUser || !currentUser.clearances.some(clearance => clearance >= 5)) {
            history.push("/account");
        }
    });

    return (
        <React.Fragment>
            <AdminTabs />
            <Row>
                <Col>
                    <PageHeader title="New Strain"/>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mb-3 mb-lg-0">
                    <CreateEditStrainForm
                        onSubmit={(newStrain) => {
                            const strain: StrainRequest = {
                                name: newStrain.name!,
                                strainTypeId: newStrain.strainTypeId!,
                                ouncePrice: newStrain.ouncePrice!,
                                quadPrice: newStrain.quadPrice!,
                                eighthPrice: newStrain.gramPrice!,
                                gramPrice: newStrain.gramPrice!
                            };
                            console.log(strain);
                        }}
                        submitBtnText="Create"
                        setPreview={setPreviewStrain}
                    />
                </Col>
                {renderPreview()}
            </Row>
        </React.Fragment>
    );

    function renderPreview() {
        console.log(previewStrain.strainTypeId);
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
                <Col lg={6}>
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
                </Col>
            );
        }
    }
}


