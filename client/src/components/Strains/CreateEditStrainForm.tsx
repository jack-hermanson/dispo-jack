import React, {useEffect, useState} from "react";
import {Button, FormGroup, Input, InputGroup, InputGroupText, Label} from "reactstrap";
import {useStoreState} from "../../store";
import {StrainRecord, StrainRequest} from "../../data/strain";
import {stringToNum} from "../../utils/functions";

interface Props {
    onSubmit: (newStrain: Partial<StrainRequest>) => any;
    submitBtnText: string;
    initialStrain?: StrainRecord;
}

export const CreateEditStrainForm: React.FC<Props> = ({onSubmit, submitBtnText, initialStrain}: Props) => {

    useEffect(() => {
        document.getElementById("name-input")?.focus();
    });

    // form values
    const [newStrain, setNewStrain] = useState<Partial<StrainRequest>>(initialStrain || {});

    const prices = [
        {label: "Ounce (28g)", get: newStrain.ouncePrice, set: (value: number) => setNewStrain({...newStrain, ouncePrice: value})},
        {label: "Quad (7g)", get: newStrain.quadPrice, set: (value: number) => setNewStrain({...newStrain, quadPrice: value})},
        {label: "Eighth (3.5g)", get: newStrain.eighthPrice, set: (value: number) => setNewStrain({...newStrain, eighthPrice: value})},
        {label: "Gram (1g)", get: newStrain.gramPrice, set: (value: number) => setNewStrain({...newStrain, gramPrice: value})},
    ];

    const strainTypeOptions = useStoreState(state => state.strainTypes);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(newStrain);
        }}>
            {renderBasicInfo()}
            {renderPrices()}
            <div className="bottom-buttons">
                <Button color="primary" type="submit">{submitBtnText}</Button>
                <Button color="secondary" type="reset" onClick={() => {
                    setNewStrain(initialStrain || {});
                    document.getElementById("name-input")?.focus();
                }}>Reset</Button>
            </div>
        </form>
    );

    function renderBasicInfo() {
        return (
            <React.Fragment>
                <h5 className="border-bottom">Basic Info</h5>
                <FormGroup>
                    <Label htmlFor="name-input">Name</Label>
                    <Input
                        required
                        onChange={event => {
                            setNewStrain({...newStrain, name: event.target.value});
                        }}
                        value={newStrain.name}
                        id="name-input"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Type</Label>
                    <Input
                        required
                        name="strain-type-id"
                        defaultValue={newStrain.strainTypeId}
                        type="select"
                        id="strain-type-id"
                        onChange={e => setNewStrain({...newStrain, strainTypeId: parseInt(e.target.value)})}
                    >
                        <option data-default={true} value="">Please select...</option>
                        {strainTypeOptions?.map(st => (
                            <option key={st.id}
                                    value={st.id}>{st.name}</option>
                        ))}
                    </Input>
                </FormGroup>
            </React.Fragment>
        )
    }

    function renderPrices() {
        return (
            <React.Fragment>
                <h5 className="border-bottom">Prices</h5>
                {prices.map(priceField => (
                    <FormGroup key={priceField.label}>
                        <Label for={`${priceField.label}-input`}>{priceField.label}</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input
                                required
                                type="number"
                                id={`${priceField.label}-input`}
                                value={priceField.get}
                                onChange={e => {
                                    const num = stringToNum(e.target.value);
                                    if (!num) {
                                        e.preventDefault();
                                    } else {
                                        priceField.set(num);
                                    }
                                }}
                            />
                        </InputGroup>
                    </FormGroup>
                ))}
            </React.Fragment>
        )
    }
}
