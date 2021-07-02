import React, { useEffect, useState } from "react";
import {
    StrainRecord,
    StrainRequest,
} from "../../../../../shared/resource_models/strain";
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
import { useStoreActions, useStoreState } from "../../../store";

interface Props {
    onSubmit: (newStrain: StrainRequest) => any;
    submitBtnText: string;
    initialStrain?: StrainRecord;
}

export const CreateEditStrainForm: React.FC<Props> = ({
    onSubmit,
    submitBtnText,
    initialStrain,
}: Props) => {
    useEffect(() => {
        document.getElementById("name-input")?.focus();
        if (initialStrain) {
            setName(initialStrain.name);
            setStrainTypeId(initialStrain.strainTypeId.toString());
            setOuncePrice(initialStrain.ouncePrice.toString());
            setQuadPrice(initialStrain.quadPrice.toString());
            setEighthPrice(initialStrain.eighthPrice.toString());
            setGramPrice(initialStrain.gramPrice.toString());
        }
    }, [initialStrain]);

    const strainTypes = useStoreState(state => state.strainTypes);
    const addAlert = useStoreActions(actions => actions.addAlert);

    const [name, setName] = useState("");
    const [strainTypeId, setStrainTypeId] = useState("");
    const [ouncePrice, setOuncePrice] = useState("");
    const [quadPrice, setQuadPrice] = useState("");
    const [eighthPrice, setEighthPrice] = useState("");
    const [gramPrice, setGramPrice] = useState("");

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                submit();
            }}
        >
            <FormGroup>
                <Label for="name-input">Name</Label>
                <Input
                    id="name-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label>Type</Label>
                <Input
                    required
                    value={strainTypeId}
                    type="select"
                    onChange={e => setStrainTypeId(e.target.value)}
                >
                    <option value="">Please select...</option>
                    {strainTypes?.map(st => (
                        <option value={`${st.id}`} key={`strain-type-${st.id}`}>
                            {st.name}
                        </option>
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
                                required
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
                                required
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
                                required
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
                                required
                                type="number"
                                onChange={e => setGramPrice(e.target.value)}
                                value={gramPrice}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
            <div className="mt-4 bottom-buttons">
                <Button type="submit" color="primary">
                    {submitBtnText}
                </Button>
                <Button
                    type="reset"
                    onClick={e => {
                        e.preventDefault();
                        reset();
                    }}
                    color="secondary"
                >
                    Reset
                </Button>
            </div>
        </form>
    );

    function reset() {
        if (initialStrain) {
            setName(initialStrain.name);
            setStrainTypeId(initialStrain.strainTypeId.toString());
            setOuncePrice(initialStrain.ouncePrice.toString());
            setQuadPrice(initialStrain.quadPrice.toString());
            setEighthPrice(initialStrain.eighthPrice.toString());
            setGramPrice(initialStrain.gramPrice.toString());
        } else {
            setName("");
            setStrainTypeId("");
            setOuncePrice("");
            setQuadPrice("");
            setEighthPrice("");
            setGramPrice("");
        }

        document.getElementById("name-input")?.focus();
    }

    function submit() {
        const valid =
            name.length &&
            strainTypeId.length &&
            ouncePrice.length &&
            quadPrice.length &&
            eighthPrice.length &&
            quadPrice.length;
        if (valid) {
            try {
                const newStrain: StrainRequest = {
                    name: name,
                    strainTypeId: parseInt(strainTypeId),
                    ouncePrice: parseFloat(ouncePrice),
                    quadPrice: parseFloat(quadPrice),
                    eighthPrice: parseFloat(eighthPrice),
                    gramPrice: parseFloat(gramPrice),
                };
                onSubmit(newStrain);
            } catch (error) {
                addAlert({
                    color: "danger",
                    text: `Error: ${error.message}.`,
                    error: true,
                });
                window.scrollTo(0, 0);
            }
        } else {
            addAlert({
                color: "danger",
                text: "Please fill out all required values.",
                error: true,
            });
            window.scrollTo(0, 0);
        }
    }
};
