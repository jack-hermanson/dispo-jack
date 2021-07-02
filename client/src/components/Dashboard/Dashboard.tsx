import React from "react";
import { useStoreState } from "../../store";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib";

export const Dashboard: React.FC = () => {
    const strainTypes = useStoreState(state => state.strainTypes);
    const strains = useStoreState(state => state.strains);
    const batches = useStoreState(state => state.batches);

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
                ) : (
                    <LoadingSpinner />
                )}
            </div>
            <div>
                <label>Strains</label>
                {strainTypes ? (
                    <ul>
                        {strainTypes.map(strainType => (
                            <li key={strainType.id}>{strainType.name}</li>
                        ))}
                    </ul>
                ) : (
                    <LoadingSpinner />
                )}
            </div>
            <div>
                <label>Batches</label>
                {batches ? (
                    <ul>
                        {batches.map(batch => (
                            <li key={batch.id}>{batch.id}</li>
                        ))}
                    </ul>
                ) : (
                    <LoadingSpinner />
                )}
            </div>
        </div>
    );
};
