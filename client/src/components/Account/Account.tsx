import React, {useEffect} from "react";
import {PageHeader} from "../Utils/PageHeader";
import {useStoreState} from "../../store";
import {useHistory} from "react-router-dom";

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
            <PageHeader title="Account" />
            <p>Hello, {currentUser?.account?.username}</p>
        </React.Fragment>
    );
}
