import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../stores/_store";

export const useMinClearance = (clearance?: number) => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (!currentUser) {
            history.replace("/account/login");
        } else {
            if (clearance) {
                const userClearances = currentUser.clearances;
                if (!userClearances.some(c => c >= clearance)) {
                    history.replace("/forbidden");
                }
            }
        }
    }, [currentUser, history, clearance]);
};
