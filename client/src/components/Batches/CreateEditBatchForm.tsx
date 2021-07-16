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
import { Formik, FormikProps, Field, Form } from "formik";
import { LoadingSpinner } from "jack-hermanson-component-lib";

interface Props {
    existingBatch?: BatchRecord;
    onSubmit: (batchRequest: BatchRequest) => any;
}

interface FormValues {
    strainId: string;
    size: "" | number;
    dateReceived: string;
    thcPotency: "" | number;
    cbdPotency: "" | number;
    imageUrl: string;
    notes: string;
}

export const CreateEditBatchForm: React.FC<Props> = ({
    existingBatch,
    onSubmit,
}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    return (
        <Formik
            initialValues={{
                strainId: "",
                size: "",
                dateReceived: new Date().toInputFormat(),
                thcPotency: "",
                cbdPotency: "",
                imageUrl: "",
                notes: "",
            }}
            onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                console.log(data);
                setTimeout(() => {
                    setSubmitting(false);
                }, 1000);
            }}
        >
            {({ values, isSubmitting }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <React.Fragment>
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
                        </React.Fragment>
                    )}

                    <pre className="mt-3">
                        {JSON.stringify(values, null, 2)}
                    </pre>
                </Form>
            )}
        </Formik>
    );

    function renderStrain() {
        const id = "strain-input";
        if (strainTypes && strains) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        Strain
                    </Label>
                    <Field name="strainId" type="select" as={Input} id={id}>
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
                    </Field>
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
                    <Field name="size" type="number" id={id} as={Input} />
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
                <Field
                    name="dateReceived"
                    type="datetime-local"
                    id={id}
                    as={Input}
                />
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
                    <Field name="thcPotency" id={id} type="number" as={Input} />
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
                    <Field name="cbdPotency" id={id} type="number" as={Input} />
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
                <Field name="imageUrl" type="url" id={id} as={Input} />
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
                <Field name="notes" type="textarea" id={id} as={Input} />
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
