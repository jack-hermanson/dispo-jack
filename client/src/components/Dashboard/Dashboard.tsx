import React from "react";
import {PageHeader} from "../Utils/PageHeader";
import {useStoreState} from "../../store";
import {LoadingSpinner} from "../Utils/LoadingSpinner";

export const Dashboard: React.FC = () => {

    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);

    return (
        <div>
            <PageHeader title={"Dashboard"} />

            <div>
                <label>Strain Types</label>
                {strains ? (
                    <ul>
                        {strains.map(strain => (
                            <li key={strain.id}>{strain.name}</li>
                        ))}
                    </ul>
                ) : <LoadingSpinner />}

            </div>
            <div>
                <label>Strains</label>
                {strainTypes ? (
                    <ul>
                        {strainTypes.map(strainType => (
                            <li key={strainType.id}>{strainType.name}</li>
                        ))}
                    </ul>
                ) : <LoadingSpinner />}
            </div>

        </div>
    );
}