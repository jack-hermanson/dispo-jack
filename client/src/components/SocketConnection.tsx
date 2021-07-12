import React, { Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions } from "../stores/_store";
import { SocketEvent } from "../../../shared/enums";

export const SocketConnection: React.FC = () => {
    const fetchStrains = useStoreActions(actions => actions.fetchStrains);
    const fetchStrainTypes = useStoreActions(
        actions => actions.fetchStrainTypes
    );
    const fetchBatches = useStoreActions(actions => actions.fetchBatches);
    const tokenLogin = useStoreActions(actions => actions.tokenLogin);

    useEffect(() => {
        const socket: Socket = io("/");

        // event handlers
        socket.on(SocketEvent.STATUS, data => {
            console.log("status update:", data);
        });
        socket.on(SocketEvent.UPDATE_STRAINS, () => {
            console.log("strains update");
            fetchStrains();
        });

        tokenLogin();
        fetchStrainTypes();
        fetchStrains();
        fetchBatches();
    }, [fetchStrains, fetchBatches, fetchStrainTypes, tokenLogin]);

    return <Fragment />;
};
