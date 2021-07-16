import React from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Row,
} from "reactstrap";
import { useStoreState } from "../../stores/_store";
import {
    BatchRecord,
    BatchRequest,
} from "../../../../shared/resource_models/batch";
import { Formik } from "formik";

interface Props {
    existingBatch?: BatchRecord;
    onSubmit: (batchRequest: BatchRequest) => any;
}

export const CreateEditBatchForm: React.FC<Props> = ({
    existingBatch,
    onSubmit,
}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    return (
        <form>
            {renderStrain()}
            <Row>
                <Col xs={12} lg={6}>
                    {renderSize()}
                </Col>
                <Col xs={12} lg={6}>
                    {renderDate()}
                </Col>
            </Row>
            <Row>
                <Col xs={12} lg={6}>
                    {renderThcPotency()}
                </Col>
                <Col xs={12} lg={6}>
                    {renderCbdPotency()}
                </Col>
            </Row>
            {renderImageUrl()}
            {renderNotes()}
            {renderButtons()}
        </form>
    );

    function renderStrain() {
        const id = "strain-input";
        if (strainTypes && strains) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        Strain
                    </Label>
                    <Input required type="select" id={id}>
                        <option value="">Select a strain...</option>
                        {strainTypes.map(strainType => (
                            <optgroup
                                label={strainType.name}
                                key={strainType.id}
                            >
                                {strains
                                    .filter(
                                        strain =>
                                            strain.strainTypeId ===
                                            strainType.id
                                    )
                                    .map(strain => (
                                        <option
                                            key={strain.id}
                                            value={strain.id}
                                        >
                                            {strain.name}
                                        </option>
                                    ))}
                            </optgroup>
                        ))}
                    </Input>
                </FormGroup>
            );
        }
    }

    function renderSize() {
        const id = "size-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Size
                </Label>
                <InputGroup>
                    <Input required id={id} type="number" />
                    <InputGroupText>grams</InputGroupText>
                </InputGroup>
            </FormGroup>
        );
    }

    function renderDate() {
        const id = "date-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Date Received
                </Label>
                <Input required type="datetime-local" id={id} />
            </FormGroup>
        );
    }

    function renderThcPotency() {
        const id = "thc-potency-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    THC Potency
                </Label>
                <InputGroup>
                    <Input required id={id} type="number" />
                    <InputGroupText>%</InputGroupText>
                </InputGroup>
            </FormGroup>
        );
    }

    function renderCbdPotency() {
        const id = "cbd-potency-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    CBD Potency
                </Label>
                <InputGroup>
                    <Input required id={id} type="number" />
                    <InputGroupText>%</InputGroupText>
                </InputGroup>
            </FormGroup>
        );
    }

    function renderImageUrl() {
        const id = "image-url-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    Image URL
                </Label>
                <Input type="url" id={id} />
            </FormGroup>
        );
    }

    function renderNotes() {
        const id = "notes-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    Notes
                </Label>
                <Input type="textarea" id={id} />
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="mt-4 bottom-buttons">
                <Button color="primary" type="submit">
                    Submit
                </Button>
                <Button color="secondary" type="reset">
                    Reset
                </Button>
            </div>
        );
    }
};
