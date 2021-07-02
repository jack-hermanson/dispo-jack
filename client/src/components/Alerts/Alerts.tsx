import React from "react";
import { Col, Row } from "reactstrap";
import { useStoreState } from "../../store";
import { AlertPanel } from "./AlertPanel";

export const Alerts: React.FC = () => {
    const alerts = useStoreState(state => state.alerts);

    return (
        <React.Fragment>
            {alerts.length > 0 && (
                <Row>
                    <Col>
                        {alerts.map(alert => (
                            <AlertPanel
                                key={`alert.text${Math.random()}`}
                                alert={alert}
                            />
                        ))}
                    </Col>
                </Row>
            )}
        </React.Fragment>
    );
};
