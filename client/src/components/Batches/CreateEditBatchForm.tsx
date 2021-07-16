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
import { Formik, FormikProps, Field, Form, FormikErrors } from "formik";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import * as yup from "yup";
import moment from "moment";

interface Props {
    existingBatch?: BatchRecord;
    onSubmit: (batchRequest: BatchRequest) => Promise<any>;
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

const validationSchema = yup.object().shape({
    strainId: yup.string().label("Strain").required(),
    size: yup.number().positive().label("Size").required(),
    dateReceived: yup.string().label("Date Received").required(),
    thcPotency: yup.number().label("THC Potency").positive().required(),
    cbdPotency: yup.number().label("CBD Potency").positive().required(),
    imageUrl: yup.string().url().label("Image URL").optional(),
    notes: yup.string().label("Notes").optional(),
});

export const CreateEditBatchForm: React.FC<Props> = ({
    existingBatch,
    onSubmit,
}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    return (
        <Formik
            initialValues={{
                strainId: existingBatch?.strainId.toString() || "",
                size: existingBatch?.size || "",
                dateReceived: existingBatch
                    ? new Date(existingBatch.dateReceived).toInputFormat()
                    : new Date().toInputFormat(),
                thcPotency: existingBatch?.thcPotency || "",
                cbdPotency: existingBatch?.cbdPotency || "",
                imageUrl: existingBatch?.imageUrl || "",
                notes: existingBatch?.notes || "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    strainId: parseInt(data.strainId),
                    size: data.size as number,
                    dateReceived: moment(data.dateReceived).toDate(),
                    thcPotency: data.thcPotency as number,
                    cbdPotency: data.cbdPotency as number,
                    notes: data.notes,
                    imageUrl: data.imageUrl,
                });
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ errors, isSubmitting }: FormikProps<FormValues>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <React.Fragment>
                            {renderStrain(errors)}
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderSize(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderDate(errors)}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderThcPotency(errors)}
                                </Col>
                                <Col xs={12} lg={6}>
                                    {renderCbdPotency(errors)}
                                </Col>
                            </Row>
                            {renderImageUrl(errors)}
                            {renderNotes(errors)}
                            {renderButtons()}
                        </React.Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderStrain(errors: FormikErrors<FormValues>) {
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
                    <FormError>{errors.strainId}</FormError>
                </FormGroup>
            );
        }
    }

    function renderSize(errors: FormikErrors<FormValues>) {
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
                <FormError>{errors.size}</FormError>
            </FormGroup>
        );
    }

    function renderDate(errors: FormikErrors<FormValues>) {
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
                <FormError>{errors.dateReceived}</FormError>
            </FormGroup>
        );
    }

    function renderThcPotency(errors: FormikErrors<FormValues>) {
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
                <FormError>{errors.thcPotency}</FormError>
            </FormGroup>
        );
    }

    function renderCbdPotency(errors: FormikErrors<FormValues>) {
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
                <FormError>{errors.cbdPotency}</FormError>
            </FormGroup>
        );
    }

    function renderImageUrl(errors: FormikErrors<FormValues>) {
        const id = "image-url-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    Image URL
                </Label>
                <Field name="imageUrl" type="text" id={id} as={Input} />
                <FormError>{errors.imageUrl}</FormError>
            </FormGroup>
        );
    }

    function renderNotes(errors: FormikErrors<FormValues>) {
        const id = "notes-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
                    Notes
                </Label>
                <Field name="notes" type="textarea" id={id} as={Input} />
                <FormError>{errors.notes}</FormError>
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
