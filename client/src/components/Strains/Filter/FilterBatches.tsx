import React from "react";
import {FormGroup, Input, Label} from "reactstrap";

interface Props {
    checked: boolean;
    handleChange: (checked: boolean) => any;
}

export const FilterBatches: React.FC<Props> = ({checked, handleChange}: Props) => {

    return (
        <FormGroup>
            <Label>Batches</Label>

            <FormGroup check>
                <Input
                    onChange={e => handleChange(e.target.checked)}
                    checked={checked}
                    type="checkbox"
                    id="has-batch-checkbox"
                />
                <Label for="has-batch-checkbox">Has Active Batch</Label>
            </FormGroup>
        </FormGroup>
    );
}