import React, {useEffect, useState} from "react";
import {StrainRecord, StrainRequest} from "../../../data/strain";
import {Button, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap";

interface Props {
    onSubmit: (newStrain: Partial<StrainRequest>) => any;
    submitBtnText: string;
    initialStrain?: StrainRecord;
}

export const CreateEditStrainForm: React.FC<Props> = ({onSubmit, submitBtnText, initialStrain}: Props) => {

    useEffect(() => {
        document.getElementById("name-input")?.focus();
    }, []);

    const [name, setName] = useState("");
    const [strainTypeId, setStrainTypeId] = useState("");
    const [ouncePrice, setOuncePrice] = useState("");
    const [quadPrice, setQuadPrice] = useState("");
    const [eighthPrice, setEighthPrice] = useState("");
    const [gramPrice, setGramPrice] = useState("");

    return (
        <form>
            <FormGroup>
                <Label for="name-input">Name</Label>
                <Input id="name-input" value={name} onChange={e => setName(e.target.value)}/>
            </FormGroup>
            <FormGroup>
                <Label>Type</Label>
                <Input required defaultValue="" type="select">
                    <option value="">Please select...</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Row>
                    <Col>
                        <Label>Ounce (28g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input
                                onChange={e => setOuncePrice(e.target.value)}
                                type="number"
                                value={ouncePrice}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <Label>Quad (7g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="number"/>
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <Col>
                        <Label>Eighth (3.5g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="number"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Label>Gram (1g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="number"/>
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <div className="mt-4 bottom-buttons">
                <Button color="primary">{submitBtnText}</Button>
                <Button color="secondary">Reset</Button>
            </div>
        </form>
    )
}
