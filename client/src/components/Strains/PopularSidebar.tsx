import React from "react";
import { MobileToggleCard } from "jack-hermanson-component-lib";
import { ListGroup, ListGroupItem } from "reactstrap";
import { AgnosticLink } from "../Utils/AgnosticLink";

export const PopularSidebar: React.FC = () => {
    return (
        <React.Fragment>
            <MobileToggleCard className="mt-4" cardTitle="Popular">
                <ListGroup flush>
                    <ListGroupItem>
                        <AgnosticLink
                            linkType="internal"
                            linkText="Test Strain"
                            path="/"
                            className="dotted-link"
                        />
                    </ListGroupItem>
                </ListGroup>
            </MobileToggleCard>
        </React.Fragment>
    );
};
