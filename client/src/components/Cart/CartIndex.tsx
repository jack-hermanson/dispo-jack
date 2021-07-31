import React from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../stores/_store";

export const CartIndex: React.FC = () => {
    const cart = useStoreState(state => state.cart);
    const cartBatches = useStoreState(state => state.cartBatches);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="My Cart" />
                </Col>
            </Row>
            <Row>
                <Col>{renderCart()}</Col>
            </Row>
        </div>
    );

    function renderCart() {
        if (cart && cartBatches) {
            return (
                <div>
                    <p>Body</p>
                </div>
            );
        }
    }
};
