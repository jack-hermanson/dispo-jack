import React from "react";
import {MobileToggleCard} from "../Utils/MobileToggleCard";
import {ListGroup, ListGroupItem} from "reactstrap";
import {AgnosticLink} from "../Utils/AgnosticLink";

export const PopularSidebar: React.FC = () => {
    return (
        <React.Fragment>
            <MobileToggleCard flush className="mt-4" cardTitle="Popular">
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
    )
}
