import { FC } from "react";
import { RegisterRequest } from "../../../../shared/resource_models/account";
import { Form, Formik } from "formik";

interface Props {
    onSubmit: (requestBody: RegisterRequest) => void;
}

export const RegisterForm: FC<Props> = ({ onSubmit }: Props) => {
    return (
        <Formik
            initialValues={{
                username: "",
                password: "",
            }}
        >
            <Form></Form>
        </Formik>
    );
};
