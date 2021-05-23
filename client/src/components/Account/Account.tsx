import React, {useEffect} from "react";
import {PageHeader} from "../Utils/PageHeader";
import {useStoreState} from "../../store";
import {useHistory} from "react-router-dom";
import {Col, Row} from "reactstrap";
import {KeyValListGroup} from "../Utils/KeyValListGroup";
import {LoadingSpinner} from "../Utils/LoadingSpinner";
import {formatPhoneNumber} from "../../utils/functions";

export const Account: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);

    const history = useHistory();

    useEffect(() => {
        if (!currentUser) {
            history.push("/account/login");
        }
        console.log(currentUser);
    });

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="Account"/>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    {currentUser ? (
                        <KeyValListGroup keyValPairs={[
                            {
                                key: "Username",
                                val: currentUser.account.username
                            },
                            {
                                key: "Email",
                                val: currentUser.account.email
                            },
                            {
                                key: "Name",
                                val: `${currentUser.person.firstName} ${currentUser.person.lastName}`
                            },
                            {
                                key: "Phone number",
                                val: formatPhoneNumber(currentUser.person.phone)
                            }
                        ]}/>
                    ) : <LoadingSpinner/>}
                </Col>
            </Row>

        </React.Fragment>
    );
}
