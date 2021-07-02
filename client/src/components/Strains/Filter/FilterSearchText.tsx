import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

interface Props {
    searchText: string;
    handleSearchTextChange: (text: string) => any;
}

export const FilterSearchText: React.FC<Props> = ({
    searchText,
    handleSearchTextChange,
}: Props) => {
    return (
        <FormGroup>
            <FormGroup>
                <Label htmlFor="search-input">Search</Label>
                <Input
                    type="search"
                    id="search-input"
                    value={searchText}
                    onChange={event =>
                        handleSearchTextChange(event.target.value)
                    }
                />
            </FormGroup>
        </FormGroup>
    );
};
