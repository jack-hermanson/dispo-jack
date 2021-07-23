import React from "react";
import { RegisterRequest } from "../../../../shared/resource_models/account";
import { Form, Formik, FormikErrors, FormikProps, Field } from "formik";
import * as yup from "yup";
import { FormError, LoadingSpinner } from "jack-hermanson-component-lib";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

interface Props {
    onSubmit: (requestBody: RegisterRequest) => Promise<void>;
}

const validationSchema = yup.object().shape({
    username: yup.string().label("Username").required().min(3).max(20),
    password: yup.string().label("Password").required().min(3),
    email: yup.string().label("Email").email().required(),
    firstName: yup.string().label("First Name").required().min(2),
    lastName: yup.string().label("Last Name").required().min(2),
    phone: yup
        .string()
        .label("Phone Number")
        .required()
        .min(10)
        .matches(
            /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            "That doesn't look like a phone number"
        ),
});

export const RegisterForm: React.FC<Props> = ({ onSubmit }: Props) => {
    return (
        <Formik
            initialValues={{
                username: "",
                password: "",
                email: "",
                firstName: "",
                lastName: "",
                phone: "",
            }}
            onSubmit={async (data, { setSubmitting }) => {
                setSubmitting(true);
                await onSubmit({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                });
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ errors, isSubmitting }: FormikProps<RegisterRequest>) => (
                <Form>
                    {isSubmitting ? (
                        <LoadingSpinner />
                    ) : (
                        <React.Fragment>
                            <Row>
                                <Col xs={12} lg={6}>
                                    {renderUsername(errors)}
                                </Col>
                                <Col xs={12} lg={6}></Col>
                            </Row>
                        </React.Fragment>
                    )}
                </Form>
            )}
        </Formik>
    );

    function renderUsername(errors: FormikErrors<RegisterRequest>) {
        const id = "username-input";

        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Username
                </Label>
                <Field
                    autoFocus={true}
                    name="username"
                    id={id}
                    type="text"
                    as={Input}
                />
                <FormError>{errors.username}</FormError>
            </FormGroup>
        );
    }
};
