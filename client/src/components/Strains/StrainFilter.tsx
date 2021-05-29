import React, {useState} from "react";
import {Button, FormGroup, Input, Label} from "reactstrap";
import {LoadingSpinner} from "../Utils/LoadingSpinner";
import {useStoreState} from "../../store";
import {StrainAndBatch, StrainRecord} from "../../data/strain";
import {MobileToggleCard} from "../Utils/MobileToggleCard";

interface Props {
    setFilteredStrains: (strainAndBatches: StrainAndBatch[]) => any;
}

export const StrainFilter: React.FC<Props> = ({setFilteredStrains}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strainsAndBatches = useStoreState(state => state.strainsInStock);

    const [searchText, setSearchText] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);

    return (
        <MobileToggleCard cardTitle="Filter">
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
                                <Input
                                    onChange={event => handleTypeChange(event, strainType.id)}
                                    id={`strain-type-${strainType.id}`}
                                    type="checkbox"
                                    checked={selectedTypes.includes(strainType.id)}
                                />
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
        </MobileToggleCard>
    );

    function reset() {
        if (strainsAndBatches) {
            setFilteredStrains(strainsAndBatches);
        }
        setSearchText("");
        setSelectedTypes([]);
        document.getElementById("search-input")?.focus();
    }

    function handleSearchTextChange(text: string) {
        setSearchText(text);
        filterStrains(text, selectedTypes);
    }

    function filterStrains(matchText: string, typeIds: number[]) {
        if (strainsAndBatches) {
            const matches = strainsAndBatches
                .filter(s => s.strain.name.toLowerCase().includes(matchText.toLowerCase()))
                .filter(s => typeIds.includes(s.strain.strainTypeId) || !typeIds.length);
            setFilteredStrains(matches);
        }
    }

    function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>, strainTypeId: number) {
        const checked = event.target.checked;
        const alreadyInList = selectedTypes.some(s => s === strainTypeId);
        let newSelectedTypes: number[] = [];

        if (checked && !alreadyInList) {
            newSelectedTypes = [...selectedTypes, strainTypeId];
        } else if (!checked && alreadyInList) {
            newSelectedTypes = selectedTypes.filter(n => n !== strainTypeId);
        }

        filterStrains(searchText, newSelectedTypes);
        setSelectedTypes(newSelectedTypes);
    }
}
