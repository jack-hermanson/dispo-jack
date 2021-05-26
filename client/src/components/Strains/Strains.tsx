import React, {useEffect, useState} from "react";
import {Col, Row} from "reactstrap";
import {PageHeader} from "../Utils/PageHeader";
import {useStoreState} from "../../store";
import {LoadingSpinner} from "../Utils/LoadingSpinner";
import {Strain} from "./Strain";
import {StrainFilter} from "./StrainFilter";
import {StrainRecord} from "../../data/strain";
import {PopularSidebar} from "./PopularSidebar";

export const Strains: React.FC = () => {
    const strains = useStoreState(state => state.strains);
    const [filteredStrains, setFilteredStrains] = useState<StrainRecord[] | undefined>(undefined);

    useEffect(() => {
        setFilteredStrains(strains);
    }, [strains, setFilteredStrains]);

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="Strains" />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <div className="sticky-top mb-4 mb-lg-0">
                        <StrainFilter setFilteredStrains={setFilteredStrains} />
                        <PopularSidebar />
                    </div>
                </Col>
                <Col lg={9}>
                    <Row>
                        {filteredStrains ? (
                            filteredStrains.map(strain => (
                                <Col lg={6} key={strain.id}>
                                    <Strain strain={strain} />
                                </Col>
                            ))
                        ) : <LoadingSpinner />}
                    </Row>

                </Col>
            </Row>
        </React.Fragment>
    );
}
