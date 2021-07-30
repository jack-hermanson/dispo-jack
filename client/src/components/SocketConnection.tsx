import React, { Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions, useStoreState } from "../stores/_store";
import { SocketEvent } from "../../../shared/enums";

export const SocketConnection: React.FC = () => {
    const currentUser = useStoreState(state => state.currentUser);
    const cart = useStoreState(state => state.cart);

    const fetchStrains = useStoreActions(actions => actions.fetchStrains);
    const fetchStrainTypes = useStoreActions(
        actions => actions.fetchStrainTypes
    );
    const fetchBatches = useStoreActions(actions => actions.fetchBatches);
    const tokenLogin = useStoreActions(actions => actions.tokenLogin);
    const fetchCustomerCart = useStoreActions(
        actions => actions.fetchCustomerCart
    );
    const fetchEmployeeCart = useStoreActions(
        actions => actions.fetchEmployeeCart
    );
    const fetchCartBatches = useStoreActions(
        actions => actions.fetchCartBatches
    );

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
        socket.on(SocketEvent.UPDATE_BATCHES, () => {
            console.log("batches update");
            fetchBatches();
        });

        if (currentUser) {
            if (cart) {
                fetchCartBatches(cart.id);
            } else if (currentUser.clearances.some(c => c >= 2)) {
                fetchEmployeeCart(currentUser.account.token!);
            } else {
                fetchCustomerCart(currentUser.account.token!);
            }
        } else {
            tokenLogin();
        }

        fetchStrainTypes();
        fetchStrains();
        fetchBatches();
    }, [
        fetchStrains,
        fetchBatches,
        fetchStrainTypes,
        tokenLogin,
        currentUser,
        fetchEmployeeCart,
        fetchCustomerCart,
        fetchCartBatches,
        cart,
    ]);

    return <Fragment />;
};
