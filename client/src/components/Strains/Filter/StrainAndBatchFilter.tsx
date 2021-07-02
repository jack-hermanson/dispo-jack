import React, { useState } from "react";
import { useStoreState } from "../../../store";
import { StrainAndBatch } from "../../../data/strain";
import { MobileToggleCard } from "jack-hermanson-component-lib";
import { FilterTypes } from "./FilterTypes";
import { FilterSearchText } from "./FilterSearchText";
import { ResetFilters } from "./ResetFilters";
import { handleCheckChange } from "../../../utils/functions";
import { CardBody } from "reactstrap";

interface Props {
    setFilteredStrains: (strainAndBatches: StrainAndBatch[]) => any;
}

export const StrainAndBatchFilter: React.FC<Props> = ({
    setFilteredStrains,
}: Props) => {
    const strainsAndBatches = useStoreState(state => state.strainsInStock);

    const [searchText, setSearchText] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);

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
                    <ResetFilters reset={reset} />
                </form>
            </CardBody>
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
                .filter(s =>
                    s.strain.name
                        .toLowerCase()
                        .includes(matchText.toLowerCase())
                )
                .filter(
                    s =>
                        typeIds.includes(s.strain.strainTypeId) ||
                        !typeIds.length
                );
            setFilteredStrains(matches);
        }
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
        filterStrains(searchText, newSelectedTypes);
        setSelectedTypes(newSelectedTypes);
    }
};
