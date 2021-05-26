import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, FormGroup, Input, Label} from "reactstrap";
import {LoadingSpinner} from "../Utils/LoadingSpinner";
import {useStoreState} from "../../store";
import {StrainRecord} from "../../data/strain";

interface Props {
    setFilteredStrains: (strains: StrainRecord[]) => any;
}

export const StrainFilter: React.FC<Props> = ({setFilteredStrains}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    const [searchText, setSearchText] = useState("");

    return (
        <Card>
            <CardHeader>
                <h5 className="mb-0">Filter</h5>
            </CardHeader>
            <CardBody>
                <form>
                    <FormGroup>
                        <Label htmlFor="search-input">Search</Label>
                        <Input
                            type="search"
                            id="search-input"
                            value={searchText}
                            onChange={event => handleSearchTextChange(event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Type</Label>
                        {strainTypes ? (
                            strainTypes.map(strainType => (
                                <FormGroup check key={strainType.id}>
                                    <Input id={`strain-type-${strainType.id}`} type="checkbox"/>
                                    <Label for={`strain-type-${strainType.id}`}>{strainType.name}</Label>
                                </FormGroup>
                            ))
                        ) : <LoadingSpinner/>}
                    </FormGroup>
                    <div className="mt-4">
                        <Button
                            type="reset"
                            block size="sm"
                            color="secondary"
                            onClick={reset}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );

    function reset() {
        if (strains) {
            setFilteredStrains(strains);
        }
        setSearchText("");
        document.getElementById("search-input")?.focus();
    }

    function handleSearchTextChange(text: string) {
        if (strains) {
            const matches = strains.filter(strain => {
                return strain.name.toLowerCase().includes(text.toLowerCase());
            });
            setFilteredStrains(matches);
        }
        setSearchText(text);
    }
}
