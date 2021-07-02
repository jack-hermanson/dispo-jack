import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import { LoadingSpinner } from "../../Utils/LoadingSpinner";
import { useStoreState } from "../../../store";

interface Props {
    selectedTypes: number[];
    handleTypeChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        strainTypeId: number
    ) => any;
}

export const FilterTypes: React.FC<Props> = ({
    selectedTypes,
    handleTypeChange,
}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);

    return (
        <FormGroup>
            <Label>Type</Label>
            {strainTypes ? (
                strainTypes.map(strainType => (
                    <FormGroup check key={strainType.id}>
                        <Input
                            onChange={event =>
                                handleTypeChange(event, strainType.id)
                            }
                            id={`strain-type-${strainType.id}`}
                            type="checkbox"
                            checked={selectedTypes.includes(strainType.id)}
                        />
                        <Label for={`strain-type-${strainType.id}`}>
                            {strainType.name}
                        </Label>
                    </FormGroup>
                ))
            ) : (
                <LoadingSpinner />
            )}
        </FormGroup>
    );
};
