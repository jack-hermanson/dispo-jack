import React, {useState} from "react";
import {Button, FormGroup, Input, Label} from "reactstrap";
import {useStoreState} from "../../../store";
import {StrainAndBatch} from "../../../data/strain";
import {MobileToggleCard} from "../../Utils/MobileToggleCard";
import {FilterTypes} from "./FilterTypes";
import {FilterSearchText} from "./FilterSearchText";
import {ResetFilters} from "./ResetFilters";

interface Props {
    setFilteredStrains: (strainAndBatches: StrainAndBatch[]) => any;
}

export const StrainAndBatchFilter: React.FC<Props> = ({setFilteredStrains}: Props) => {
    const strainsAndBatches = useStoreState(state => state.strainsInStock);

    const [searchText, setSearchText] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);

    return (
        <MobileToggleCard cardTitle="Filter">
            <form>
                <FilterSearchText searchText={searchText} handleSearchTextChange={handleSearchTextChange} />
                <FilterTypes selectedTypes={selectedTypes} handleTypeChange={handleTypeChange} />
                <ResetFilters reset={reset} />
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
