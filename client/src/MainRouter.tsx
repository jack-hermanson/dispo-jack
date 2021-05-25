import {BrowserRouter, Route} from "react-router-dom";
import {Navigation} from "./components/Navigation/Navigation";
import {Container} from "reactstrap";
import {Account} from "./components/Account/Account";
import {LoginPage} from "./components/Account/LoginPage";
import {useEffect} from "react";
import {useStoreActions} from "./store";
import {Dashboard} from "./components/Dashboard/Dashboard";

export const MainRouter = () => {

    const fetchStrainTypes = useStoreActions(actions => actions.fetchStrainTypes);
    const fetchStrains = useStoreActions(actions => actions.fetchStrains);

    useEffect(() => {
        fetchStrainTypes();
        fetchStrains();
    });

    return (
        <BrowserRouter>
            <Navigation />
            <Container className="mb-3">
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/account/login" component={LoginPage} />
            </Container>
        </BrowserRouter>
    );
}
