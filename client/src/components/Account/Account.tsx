import React, { useEffect } from "react";
import { PageHeader } from "../Utils/PageHeader";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { KeyValTable } from "jack-hermanson-component-lib";
import { LoadingSpinner } from "../Utils/LoadingSpinner";
import { formatPhoneNumber } from "jack-hermanson-ts-utils";

export const Account: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);

    const history = useHistory();

    useEffect(() => {
        if (!currentUser) {
            history.replace("/account/login");
        }
        console.log(currentUser);
    });

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader title="Account" />
                </Col>
            </Row>
            <Row>
                <Col lg={6}>{renderAccountInfo()}</Col>
            </Row>
        </React.Fragment>
    );

    function renderAccountInfo() {
        if (currentUser) {
            const keyValPairs = [
                {
                    key: "Username",
                    val: currentUser.account.username,
                },
                {
                    key: "Email",
                    val: currentUser.account.email,
                },
                {
                    key: "Name",
                    val: `${currentUser.person.firstName} ${currentUser.person.lastName}`,
                },
                {
                    key: "Phone number",
                    val: formatPhoneNumber(currentUser.person.phone),
                },
            ];
            if (currentUser.clearances.some(clearance => clearance >= 5)) {
                keyValPairs.push({
                    key: "Clearances",
                    val: currentUser.clearances.toString(),
                });
            }
            return <KeyValTable keyValPairs={keyValPairs} />;
        } else {
            return <LoadingSpinner />;
        }
    }
};
