import React, {Fragment, useEffect} from "react";
import {io, Socket} from "socket.io-client";
import {useStoreActions} from "../store";

export const SocketConnection: React.FC = () => {

    useEffect(() => {
        const socket: Socket = io("/");

        // event handlers
        socket.on("status", data => {
            console.log("status update:", data);
        });

    });

    return (
        <Fragment />
    )
}
