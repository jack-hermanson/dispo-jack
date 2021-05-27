import React, {useState} from "react";
import {Button, FormGroup, Input, InputGroup, InputGroupText, Label} from "reactstrap";
import {useStoreState} from "../../store";
import {StrainRecord} from "../../data/strain";
import {stringToNum} from "../../utils/functions";

interface Props {
    onSubmit: (event: React.FormEvent) => any;
    submitBtnText: string;
    initialStrain?: StrainRecord;
}

export const CreateEditStrainForm: React.FC<Props> = ({onSubmit, submitBtnText, initialStrain}: Props) => {

    // form values
    const [name, setName] = useState(initialStrain ? initialStrain.name : "");
    const [strainType, setStrainType] = useState(initialStrain ? initialStrain.strainTypeId.toString() : "");
    const [ouncePrice, setOuncePrice] = useState(initialStrain ? initialStrain.ouncePrice : undefined);
    const [quadPrice, setQuadPrice] = useState(initialStrain ? initialStrain.quadPrice : undefined);
    const [eighthPrice, setEighthPrice] = useState(initialStrain ? initialStrain.eighthPrice : undefined);
    const [gramPrice, setGramPrice] = useState(initialStrain ? initialStrain.gramPrice : undefined);

    const prices = [
        {label: "Ounce (28g)", get: ouncePrice, set: setOuncePrice},
        {label: "Quad (7g)", get: quadPrice, set: setQuadPrice},
        {label: "Eighth (3.5g)", get: eighthPrice, set: setEighthPrice},
        {label: "Gram (1g)", get: gramPrice, set: setGramPrice}
    ];

    const strainTypeOptions = useStoreState(state => state.strainTypes);

    return (
        <form onSubmit={onSubmit}>
            {renderBasicInfo()}
            {renderPrices()}
            <div className="bottom-buttons">
                <Button color="primary" type="submit">{submitBtnText}</Button>
                <Button color="secondary" type="reset">Reset</Button>
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
                            setName(event.target.value);
                        }}
                        value={name}
                        id="name-input"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Type</Label>
                    <Input
                        required
                        name="strain-type-id"
                        defaultValue={strainType.toString()}
                        type="select"
                        id="strain-type-id"
                        onChange={e => setStrainType(e.target.value)}
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
