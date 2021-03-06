import React, { useState } from "react";
import { useStoreActions } from "../../stores/_store";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";

export const LoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    const logIn = useStoreActions(actions => actions.logIn);
    const addAlert = useStoreActions(actions => actions.addAlert);

    return (
        <React.Fragment>
            <form
                onSubmit={async event => {
                    event.preventDefault();
                    try {
                        await logIn({ username, password });
                        history.replace("/account");
                    } catch (error) {
                        let message = "Error";
                        if (error.response) {
                            switch (error.response.status) {
                                case 400:
                                case 404:
                                    message = "Incorrect login information.";
                                    break;
                                case 500:
                                    message = "Server error.";
                                    break;
                                default:
                                    message = `Error with status code ${error.response.status}.`;
                            }
                        } else {
                            message = error.message;
                        }
                        addAlert({
                            error: true,
                            text: message,
                            color: "danger",
                        });
                        console.error(error);
                    }
                }}
            >
                <legend>Log In</legend>
                <FormGroup>
                    <Label for="username-input">Username</Label>
                    <Input
                        autoFocus
                        required
                        id="username-input"
                        value={username}
                        onChange={e =>
                            setUsername(e.target.value.toLowerCase())
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password-input">Password</Label>
                    <Input
                        required
                        type="password"
                        id="password-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormGroup>
                <div className="bottom-buttons">
                    <Button type="submit" color="primary">
                        Log In
                    </Button>
                    <Button
                        type="reset"
                        color="secondary"
                        onClick={() => {
                            setUsername("");
                            setPassword("");
                            document.getElementById("username-input")?.focus();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
};
