import React, { useState } from "react";
import { StrainRecord } from "../../../data/strain";
import { MobileToggleCard } from "jack-hermanson-component-lib";
import { useStoreState } from "../../../store";
import { FilterSearchText } from "./FilterSearchText";
import { handleCheckChange } from "../../../utils/functions";
import { FilterTypes } from "./FilterTypes";
import { ResetFilters } from "./ResetFilters";
import { FilterBatches } from "./FilterBatches";
import { CardBody } from "reactstrap";

interface Props {
    setFilteredStrains: (strains: StrainRecord[]) => any;
}

export const StrainFilter: React.FC<Props> = ({
    setFilteredStrains,
}: Props) => {
    const [searchText, setSearchText] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [strainsWithBatches, setStrainsWithBatches] = useState(false);

    const strains = useStoreState(state => state.strains);
    const batches = useStoreState(state => state.batches);

    return (
        <MobileToggleCard cardTitle="Filter">
            <CardBody>
                <form>
                    <FilterSearchText
                        searchText={searchText}
                        handleSearchTextChange={handleSearchTextChange}
                    />
                    <FilterTypes
                        selectedTypes={selectedTypes}
                        handleTypeChange={handleTypeChange}
                    />
                    <FilterBatches
                        checked={strainsWithBatches}
                        handleChange={handleActiveBatchesChange}
                    />
                    <ResetFilters reset={reset} />
                </form>
            </CardBody>
        </MobileToggleCard>
    );

    function filterStrains(
        matchText: string,
        typeIds: number[],
        activeBatches: boolean
    ) {
        if (strains && batches) {
            let matches = strains
                .filter(s =>
                    s.name.toLowerCase().includes(matchText.toLowerCase())
                )
                .filter(
                    s => typeIds.includes(s.strainTypeId) || !typeIds.length
                );

            if (activeBatches) {
                matches = matches.filter(s => {
                    return batches.some(b => b.strainId === s.id);
                });
            }
            setFilteredStrains(matches);
        }
    }

    function handleSearchTextChange(text: string) {
        setSearchText(text);
        filterStrains(text, selectedTypes, strainsWithBatches);
    }

    function handleTypeChange(
        event: React.ChangeEvent<HTMLInputElement>,
        strainTypeId: number
    ) {
        const newSelectedTypes = handleCheckChange(
            event,
            selectedTypes,
            strainTypeId
        );
        filterStrains(searchText, newSelectedTypes, strainsWithBatches);
        setSelectedTypes(newSelectedTypes);
    }

    function handleActiveBatchesChange(onlyShowActive: boolean) {
        setStrainsWithBatches(onlyShowActive);
        filterStrains(searchText, selectedTypes, onlyShowActive);
    }

    function reset() {
        if (strains) {
            setFilteredStrains(strains);
        }
        setSearchText("");
        setSelectedTypes([]);
        setStrainsWithBatches(false);
        document.getElementById("search-input")?.focus();
    }
};
