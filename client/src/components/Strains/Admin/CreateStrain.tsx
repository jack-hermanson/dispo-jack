import React, {useEffect, useState} from "react";
import {Col, Row} from "reactstrap";
import {useStoreActions, useStoreState} from "../../../store";
import {CreateEditStrainForm} from "./CreateEditStrainForm";
import {PageHeader} from "../../Utils/PageHeader";
import {useHistory} from "react-router-dom";
import {StrainRequest} from "../../../data/strain";
import {AdminTabs} from "../../Admin/AdminTabs";
import {PreviewStrain} from "./PreviewStrain";


export const CreateStrain: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const addStrain = useStoreActions(actions => actions.addStrain);
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
                        onSubmit={(newStrain) => submitForm(newStrain)}
                        submitBtnText="Create"
                        setPreview={setPreviewStrain}
                    />
                </Col>
                <Col>
                    <div className="sticky-top">
                        <PreviewStrain previewStrain={previewStrain} />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );

    async function submitForm(newStrain: Partial<StrainRequest>) {
        if (currentUser && currentUser.account.token) {
            const strain: StrainRequest = {
                name: newStrain.name!,
                strainTypeId: newStrain.strainTypeId!,
                ouncePrice: newStrain.ouncePrice!,
                quadPrice: newStrain.quadPrice!,
                eighthPrice: newStrain.gramPrice!,
                gramPrice: newStrain.gramPrice!
            };
            try {
                await addStrain({
                    strain: strain,
                    token: currentUser.account.token
                });
            } catch (error) {
                window.scrollTo(0, 0);
            }
        }
    }
}


