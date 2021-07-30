import React, { useCallback } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { StrainAndBatch } from "../../../../shared/resource_models/strain";

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

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <h5 className="mb-0">
                    Add {strainAndBatch.strain.name} to Cart
                </h5>
            </ModalHeader>
            <ModalBody></ModalBody>
        </Modal>
    );
};
