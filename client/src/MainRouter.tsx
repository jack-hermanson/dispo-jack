import {BrowserRouter} from "react-router-dom";
import {Navigation} from "./components/Navigation/Navigation";
import {Button, Container} from "reactstrap";

export const MainRouter = () => {
    return (
        <BrowserRouter>
            <Navigation />
            <Container className="mb-3">
                <p>Test</p>
                <Button color="primary">Test</Button>
            </Container>
        </BrowserRouter>
    )
}
