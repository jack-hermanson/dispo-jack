import React, {useState} from "react";
import {Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row} from "reactstrap";
import {useStoreState} from "../../store";

interface Props {
    onSubmit: (event: React.FormEvent) => any;
}

export const CreateEditStrainForm: React.FC<Props> = ({onSubmit}) => {
    const [name, setName] = useState("");
    const strainTypes = useStoreState(state => state.strainTypes);

    return (
        <form onSubmit={onSubmit}>
            <h5 className="border-bottom">Basic Info</h5>
            <FormGroup>
                <Label htmlFor="name-input">Name</Label>
                <Input
                    onChange={event => setName(event.target.value)}
                    value={name}
                    id="name-input"
                />
            </FormGroup>
            <FormGroup>
                <Label>Type</Label>
                <Input name="strain-type-id" defaultValue="" type="select" id="strain-type-id">
                    <option data-default={true} value="">Please select...</option>
                    {strainTypes?.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                </Input>
            </FormGroup>
            <FormGroup>
                <h5 className="border-bottom">Prices</h5>

                <FormGroup>
                    <Label>Ounce (28g)</Label>
                    <InputGroup>
                        <InputGroupText>$</InputGroupText>
                        <Input type="text" />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <Label>Quad (7g)</Label>
                    <InputGroup>
                        <InputGroupText>$</InputGroupText>
                        <Input type="text" />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <Label>Quad (3.5g)</Label>
                    <InputGroup>
                        <InputGroupText>$</InputGroupText>
                        <Input type="text" />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <Label>Gram (1g)</Label>
                    <InputGroup>
                        <InputGroupText>$</InputGroupText>
                        <Input type="number" />
                    </InputGroup>
                </FormGroup>

            </FormGroup>
        </form>
    );
}
