import React, {Fragment, useEffect} from "react";
import {io, Socket} from "socket.io-client";
import {useStoreActions} from "../store";
import {SocketEvent} from "../utils/types";

export const SocketConnection: React.FC = () => {

    const fetchStrains = useStoreActions(actions => actions.fetchStrains);

    useEffect(() => {
        const socket: Socket = io("/");

        // event handlers
        socket.on(SocketEvent.STATUS as string, data => {
            console.log("status update:", data);
        });
        socket.on(SocketEvent.STRAINS_UPDATE as string, () => {
            console.log("strains update");
            fetchStrains();
        });

    }, [fetchStrains]);

    return (
        <Fragment />
    )
}
