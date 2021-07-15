import React from "react";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib";

interface Props {
    errorCode: 404 | 403;
}

export const ErrorPage: React.FC<Props> = ({ errorCode }: Props) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <PageHeader
                        title={errorCode === 404 ? "Not Found" : "Forbidden"}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p className="lead">
                        {errorCode === 404
                            ? "The URL you requested could not be found."
                            : "You do not have permission to visit this URL."}
                    </p>
                </Col>
            </Row>
        </React.Fragment>
    );
};
