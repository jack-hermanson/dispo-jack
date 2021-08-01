import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import { MobileToggleCard, PageHeader } from "jack-hermanson-component-lib";
import { useStoreState } from "../../stores/_store";
import { formatMoney } from "jack-hermanson-ts-utils";
import { StrainRecord } from "../../../../shared/resource_models/strain";
import { CartBatchRecord } from "../../../../shared/resource_models/cartBatch";
import { getCartBatchPrice } from "../../utils/functions";
import { PersonRecord } from "../../../../shared/resource_models/person";
import { PersonClient } from "../../clients/PersonClient";

export const CartIndex: React.FC = () => {
    const cart = useStoreState(state => state.cart);
    const cartBatches = useStoreState(state => state.cartBatches);
    const batches = useStoreState(state => state.batches);
    const strains = useStoreState(state => state.strains);
    const currentUser = useStoreState(state => state.currentUser);

    const isEmployee = currentUser?.clearances.some(c => c >= 2);

    const [people, setPeople] = useState<PersonRecord[] | undefined>(undefined);
    const [customerId, setCustomerId] = useState<string | number>("");
    const [customer, setCustomer] = useState<PersonRecord | undefined>(
        undefined
    );

    useEffect(() => {
        if (isEmployee && customerId && currentUser?.account.token) {
            PersonClient.getPerson(
                currentUser.account.token,
                customerId as number
            ).then(data => {
                setCustomer(data);
            });
        }
    }, [isEmployee, customerId, currentUser]);

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Cart" />
                </Col>
            </Row>
            <Row>
                <Col lg={8} className="mb-3 mb-lg-0">
                    {renderCart()}
                </Col>
                <Col lg={4}>
                    {isEmployee ? renderEmployeeSidebar() : <p>Not employee</p>}
                </Col>
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

    function renderEmployeeSidebar() {
        return (
            <MobileToggleCard cardTitle="Check Out">
                <CardBody>
                    <form
                        onReset={() => {
                            setCustomerId("");
                            setCustomer(undefined);
                            setPeople(undefined);
                        }}
                    >
                        {renderPerson()}
                        {renderSidebarButtons()}
                    </form>
                </CardBody>
            </MobileToggleCard>
        );
    }

    function renderPerson() {
        const id = "person-input";
        if (currentUser?.account.token) {
            return (
                <FormGroup>
                    <Label className="form-label" for={id}>
                        Customer
                    </Label>
                    <Input
                        onChange={async e => {
                            if (e.target.value === "") {
                                setPeople([]);
                                setCustomerId("");
                                setCustomer(undefined);
                                return;
                            }
                            const filteredPeople = await PersonClient.getPeopleFilter(
                                currentUser.account.token!,
                                e.target.value
                            );
                            setPeople(filteredPeople);
                            if (filteredPeople.length >= 1) {
                                setCustomerId(filteredPeople[0].id);
                            } else {
                                setCustomerId("");
                                setCustomer(undefined);
                            }
                        }}
                        list={id}
                        className="form-control-sm mb-1"
                        placeholder="Search..."
                    />
                    <Input
                        type="select"
                        id={id}
                        value={customerId}
                        onChange={e => setCustomerId(e.target.value)}
                    >
                        {people &&
                            people.map((person, index) => (
                                <option value={person.id} key={person.id}>
                                    {person.firstName} {person.lastName} (
                                    {index + 1} of {people.length})
                                </option>
                            ))}
                    </Input>
                    <div className="mt-1">
                        {customer ? (
                            <a href="#" className="dotted-link text-white">
                                {customer.firstName} {customer.lastName} (
                                {customer.id})
                            </a>
                        ) : (
                            <span className="text-muted">None selected</span>
                        )}
                    </div>
                </FormGroup>
            );
        }
    }

    function renderSidebarButtons() {
        return (
            <div className="mt-4 d-grid col-12">
                {isEmployee ? (
                    <React.Fragment>
                        <Button size="sm" color="secondary" type="reset">
                            Reset
                        </Button>
                        <Button className="mt-2" color="primary">
                            Submit
                        </Button>
                    </React.Fragment>
                ) : (
                    <p>Not employee</p>
                )}
            </div>
        );
    }
};
