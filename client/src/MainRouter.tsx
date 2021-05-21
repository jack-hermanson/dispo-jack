import {BrowserRouter, Route} from "react-router-dom";
import {Navigation} from "./components/Navigation/Navigation";
import {Button, Container} from "reactstrap";
import {Account} from "./components/Account/Account";

export const MainRouter = () => {
    return (
        <BrowserRouter>
            <Navigation />
            <Container className="mb-3">
                <Route exact path="/account" component={Account} />
            </Container>
        </BrowserRouter>
    )
}
