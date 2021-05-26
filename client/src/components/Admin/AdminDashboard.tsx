import React, {useEffect} from "react";
import {useStoreState} from "../../store";
import {useHistory} from "react-router-dom";
import {Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, Row} from "reactstrap";
import {PageHeader} from "../Utils/PageHeader";

export const AdminDashboard: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);

    const history = useHistory();

    useEffect(() => {
        if (!currentUser || !currentUser.clearances.some(clearance => clearance >= 5)) {
            history.push("/account");
        }
    });

    return (
        <React.Fragment>
            {currentUser && (
                <React.Fragment>
                    <Row>
                        <Col>
                            <PageHeader title="Admin Dashboard" />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4}>
                            <Card>
                                <CardHeader>
                                    <h5 className="mb-0">Actions</h5>
                                </CardHeader>
                            </Card>
                            <CardBody className="p-0">
                                <ListGroup flush>
                                    <ListGroupItem>
                                        Test
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}