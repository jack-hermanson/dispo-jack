import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    ListGroup,
    Row,
    Table,
} from "reactstrap";
import { KeyValCardBody, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../stores/_store";
import { formatMoney, KeyValPair } from "jack-hermanson-ts-utils";
import { StrainRecord } from "../../../../shared/resource_models/strain";
import { CartBatchRecord } from "../../../../shared/resource_models/cartBatch";
import { getCartBatchPrice } from "../../utils/functions";

export const CartIndex: React.FC = () => {
    const cart = useStoreState(state => state.cart);
    const cartBatches = useStoreState(state => state.cartBatches);
    const batches = useStoreState(state => state.batches);
    const strains = useStoreState(state => state.strains);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Cart" />
                </Col>
            </Row>
            <Row>
                <Col>{renderCart()}</Col>
            </Row>
        </div>
    );

    function renderCart() {
        if (cart && cartBatches && batches && strains) {
            const cartTableValues: {
                strain: StrainRecord;
                cartBatch: CartBatchRecord;
            }[] = [];
            for (let cartBatch of cartBatches) {
                const batch = batches.find(b => b.id === cartBatch.batchId);
                const strain = strains.find(s => s.id === batch!.strainId)!;
                cartTableValues.push({ strain, cartBatch });
            }
            return (
                <Card>
                    <CardBody className="p-0">
                        <Table striped className="card-table mb-0">
                            <thead>
                                <tr className="border-bottom">
                                    <th>Strain</th>
                                    <th>Amount</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartTableValues.map(
                                    ({ cartBatch, strain }) => (
                                        <tr key={cartBatch.id}>
                                            <td>{strain.name}</td>
                                            <td>{cartBatch.amount}g</td>
                                            <td>
                                                {formatMoney(
                                                    getCartBatchPrice(
                                                        cartBatch,
                                                        strain
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                            <tbody>
                                <tr className="border-top">
                                    <td className="fw-bold">Total</td>
                                    <td>
                                        {cartTableValues.reduce<number>(
                                            (a, c) => a + c.cartBatch.amount,
                                            0
                                        )}
                                        g
                                    </td>
                                    <td>
                                        {formatMoney(
                                            cartTableValues.reduce<number>(
                                                (a, { cartBatch, strain }) =>
                                                    a +
                                                    getCartBatchPrice(
                                                        cartBatch,
                                                        strain
                                                    ),
                                                0
                                            )
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            );
        }
    }
};
