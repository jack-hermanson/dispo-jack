import React, { Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions } from "../store";
import { SocketEvent } from "../../../shared/enums";

export const SocketConnection: React.FC = () => {
    const fetchStrains = useStoreActions(actions => actions.fetchStrains);

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
    }, [fetchStrains]);

    return <Fragment />;
};
