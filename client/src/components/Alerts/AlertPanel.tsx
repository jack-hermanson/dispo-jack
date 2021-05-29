import React, {useEffect, useState} from "react";
import {AlertType} from "../../utils/types";
import {Alert} from "reactstrap";
import {FontAwesomeIcon as FA} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useStoreActions, useStoreState} from "../../store";

interface Props {
    alert: AlertType;
}

export const AlertPanel: React.FC<Props> = ({alert}: Props) => {
    const setAlerts = useStoreActions(actions => actions.setAlerts);
    const alerts = useStoreState(state => state.alerts);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const delay = alert.error ? 15000 : 5000;
        setTimeLeft(delay / 1000);

        const timeout = setTimeout(() => {
            removeAlert();
        }, delay);

        const interval = setInterval(() => {
            setTimeLeft(t => t-1);
        }, 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        }
    }, [setTimeLeft]);


    return (
        <Alert color={alert.color} className="d-flex">
            <p className="mb-0">
                {alert.text}
            </p>
            <span className="ms-auto hover-mouse">
                <span className="me-2">Removing in {timeLeft} second{timeLeft !== 1 && "s"}...</span>
                <FA onClick={() => removeAlert()} icon={faTimes} />
            </span>
        </Alert>
    );

    function removeAlert() {
        setAlerts(alerts.filter(a => a !== alert));
    }
}
