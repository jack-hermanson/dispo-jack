import React, { useEffect, useState } from "react";
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

interface Props {
    existingBatch?: BatchRecord;
    onSubmit: (batchRequest: BatchRequest) => any;
}

export const CreateEditBatchForm: React.FC<Props> = ({
    existingBatch,
    onSubmit,
}: Props) => {
    useEffect(() => {
        if (existingBatch) {
            setFromBatchRecord(existingBatch);
        }
    }, [existingBatch]);

    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    const [selectedStrainId, setSelectedStrainId] = useState<number | string>(
        ""
    );
    const [size, setSize] = useState("");
    const [dateReceived, setDateReceived] = useState<string>(
        new Date().toInputFormat()
    );
    const [thcPotency, setThcPotency] = useState("");
    const [cbdPotency, setCbdPotency] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [notes, setNotes] = useState("");

    return (
        <form onSubmit={submit} onReset={reset}>
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

    function submit(event: React.FormEvent) {
        event.preventDefault();
        const batchRequest: BatchRequest = {
            strainId: parseInt(selectedStrainId.toString()),
            size: parseFloat(size),
            thcPotency: parseFloat(thcPotency),
            cbdPotency: parseFloat(cbdPotency),
            dateReceived: new Date(Date.parse(dateReceived)),
            notes: notes,
            imageUrl: imageUrl,
        };
        onSubmit(batchRequest);
    }

    function reset(event?: React.FormEvent) {
        if (event) {
            event.preventDefault();
        }
        if (existingBatch) {
            setFromBatchRecord(existingBatch);
        } else {
            setSelectedStrainId("");
            setSize("");
            setDateReceived(new Date().toInputFormat());
            setThcPotency("");
            setCbdPotency("");
            setImageUrl("");
            setNotes("");
        }
    }

    function setFromBatchRecord(batchRecord: BatchRecord) {
        setSelectedStrainId(batchRecord.strainId);
        setSize(batchRecord.size.toString());
        setDateReceived(new Date(batchRecord.dateReceived).toInputFormat());
        setThcPotency(batchRecord.thcPotency.toString());
        setCbdPotency(batchRecord.cbdPotency.toString());
        setImageUrl(batchRecord.imageUrl || "");
        setNotes(batchRecord.notes || "");
    }

    function renderStrain() {
        const id = "strain-input";
        if (strainTypes && strains) {
            return (
                <FormGroup>
                    <Label className="form-label required" for={id}>
                        Strain
                    </Label>
                    <Input
                        required
                        type="select"
                        id={id}
                        value={selectedStrainId}
                        onChange={e => {
                            setSelectedStrainId(parseInt(e.target.value));
                        }}
                    >
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
                    <Input
                        required
                        id={id}
                        type="number"
                        value={size}
                        onChange={e => setSize(e.target.value)}
                    />
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
                <Input
                    required
                    type="datetime-local"
                    id={id}
                    value={dateReceived}
                    onChange={e => {
                        setDateReceived(e.target.value);
                    }}
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
                    <Input
                        required
                        id={id}
                        type="number"
                        value={thcPotency}
                        onChange={e => {
                            console.log(e.target.value);
                            setThcPotency(e.target.value);
                        }}
                    />
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
                    <Input
                        required
                        id={id}
                        type="number"
                        value={cbdPotency}
                        onChange={e => setCbdPotency(e.target.value)}
                    />
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
                <Input
                    type="url"
                    id={id}
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                />
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
                <Input
                    type="textarea"
                    id={id}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
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
