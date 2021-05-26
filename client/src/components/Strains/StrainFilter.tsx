import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, FormGroup, Input, Label} from "reactstrap";
import {LoadingSpinner} from "../Utils/LoadingSpinner";
import {useStoreState} from "../../store";
import {StrainRecord} from "../../data/strain";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon as FA} from "@fortawesome/react-fontawesome";

interface Props {
    setFilteredStrains: (strains: StrainRecord[]) => any;
}

export const StrainFilter: React.FC<Props> = ({setFilteredStrains}: Props) => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    const [searchText, setSearchText] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [showFilter, setShowFilter] = useState(false);

    return (
        <Card>
            <CardHeader onClick={() => setShowFilter(f => !f)}>
                <h5 className="mb-0">
                    Filter
                    <FA className="d-lg-none ms-2 hover-mouse" icon={showFilter ? faCaretUp : faCaretDown} />
                </h5>
            </CardHeader>
            <CardBody className={`${showFilter ? "" : "d-none"} d-lg-flex`}>
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
                </CardBody>

        </Card>
    );

    function reset() {
        if (strains) {
            setFilteredStrains(strains);
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
        if (strains) {
            const matches = strains
                .filter(strain => strain.name.toLowerCase().includes(matchText.toLowerCase()))
                .filter(strain => typeIds.includes(strain.strainTypeId) || !typeIds.length);
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
