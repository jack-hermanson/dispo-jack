import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { StrainAndBatch } from "../../../../shared/resource_models/strain";
import { formatMoney, scrollToTop } from "jack-hermanson-ts-utils";
import { useStoreActions, useStoreState } from "../../stores/_store";

interface Props {
    isOpen: boolean;
    closeModal: () => any;
    strainAndBatch: StrainAndBatch;
}

export const AddToCartModal: React.FC<Props> = ({
    isOpen,
    closeModal,
    strainAndBatch,
}: Props) => {
    const toggle = useCallback(() => closeModal(), [closeModal]);
    const [amount, setAmount] = useState<string | number>("");
    const cart = useStoreState(state => state.cart);
    const currentUser = useStoreState(state => state.currentUser);
    const createCartBatch = useStoreActions(actions => actions.createCartBatch);
    const createCart = useStoreActions(actions => actions.createCart);

    useEffect(() => {
        // create a cart if one does not exist

        if (isOpen) {
            let employeeId, personId;

            // employee or customer?
            if (
                currentUser?.person &&
                currentUser?.clearances.some(c => c >= 2)
            ) {
                // employee
                employeeId = currentUser.person.id;
            } else if (currentUser?.person) {
                // customer
                personId = currentUser.person.id;
            }

            if (!cart) {
                createCart({
                    personId,
                    employeeId,
                });
            }
        }
    }, [cart, currentUser, createCart, isOpen]);

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Add {strainAndBatch.strain.name} to Cart
            </ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody>{renderAmount()}</ModalBody>
                {renderFooter()}
            </form>
        </Modal>
    );

    function renderAmount() {
        const id = "amount-input";
        const options = [
            { price: strainAndBatch.strain.gramPrice, value: 1 },
            { price: strainAndBatch.strain.eighthPrice, value: 3.5 },
            { price: strainAndBatch.strain.quadPrice, value: 7 },
            { price: strainAndBatch.strain.ouncePrice, value: 28 },
        ];
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Amount
                </Label>
                <Input
                    id={id}
                    type="select"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                >
                    <option value="">Please select</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.value} gram{option.value !== 1 && "s"} (
                            {formatMoney(option.price)})
                        </option>
                    ))}
                </Input>
            </FormGroup>
        );
    }

    function renderFooter() {
        return (
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    Close
                </Button>
                <Button type="submit" color="primary" disabled={amount === ""}>
                    Add to Cart
                </Button>
            </ModalFooter>
        );
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (cart) {
            try {
                await createCartBatch({
                    cartId: cart.id,
                    batchId: strainAndBatch.batch.id,
                    amount: amount as number,
                });
                toggle();
            } catch (error) {
                toggle();
                console.error(error);
                scrollToTop();
            }
        }
    }
};
