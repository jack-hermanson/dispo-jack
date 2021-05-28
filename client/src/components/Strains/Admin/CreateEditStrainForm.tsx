import React, {useEffect, useState} from "react";
import {StrainRecord, StrainRequest} from "../../../data/strain";
import {Button, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap";
import {useStoreState} from "../../../store";

interface Props {
    onSubmit: (newStrain: Partial<StrainRequest>) => any;
    submitBtnText: string;
    initialStrain?: StrainRecord;
}

export const CreateEditStrainForm: React.FC<Props> = ({onSubmit, submitBtnText, initialStrain}: Props) => {

    useEffect(() => {
        document.getElementById("name-input")?.focus();
    }, []);

    const strainTypes = useStoreState(state => state.strainTypes);

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
                <Input required defaultValue={initialStrain ? initialStrain.strainTypeId : ""} type="select" onChange={e => setStrainTypeId(e.target.value)}>
                    <option value="">Please select...</option>
                    {strainTypes?.map(st => (
                        <option value={st.id} key={`strain-type-${st.id}`}>{st.name}</option>
                    ))}
                </Input>
            </FormGroup>
            <FormGroup>
                <Row>
                    <Col>
                        <Label>Ounce (28g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input
                                type="number"
                                onChange={e => setOuncePrice(e.target.value)}
                                value={ouncePrice}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <Label>Quad (7g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input
                                type="number"
                                onChange={e => setQuadPrice(e.target.value)}
                                value={quadPrice}
                            />
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
                            <Input
                                type="number"
                                onChange={e => setEighthPrice(e.target.value)}
                                value={eighthPrice}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <Label>Gram (1g)</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input
                                type="number"
                                onChange={e => setGramPrice(e.target.value)}
                                value={gramPrice}
                            />
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
