import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navigation } from "./components/Navigation/Navigation";
import { Container } from "reactstrap";
import { Account } from "./components/Account/Account";
import { LoginPage } from "./components/Account/LoginPage";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Strains } from "./components/Strains/Strains";
import { StrainDetails } from "./components/Strains/StrainDetails";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { CreateStrain } from "./components/Strains/Admin/CreateStrain";
import { AdminStrains } from "./components/Strains/Admin/AdminStrains";
import { Alerts } from "./components/Alerts/Alerts";
import { EditStrain } from "./components/Strains/Admin/EditStrain";
import { SocketConnection } from "./components/SocketConnection";
import { Batches } from "./components/Batches/Batches";
import { BatchDetails } from "./components/Batches/BatchDetails";
import { CreateBatch } from "./components/Batches/CreateBatch";
import { Forbidden } from "./components/Errors/Forbidden";
import { NotFound } from "./components/Errors/NotFound";
import { EditBatch } from "./components/Batches/EditBatch";
import { RegisterPage } from "./components/Account/RegisterPage";
import { CartIndex } from "./components/Cart/CartIndex";

export const MainRouter = () => {
    return (
        <BrowserRouter>
            <SocketConnection />
            <Navigation />
            <Container className="mb-3">
                <Alerts />
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/account/login" component={LoginPage} />
                    <Route
                        exact
                        path="/account/register"
                        component={RegisterPage}
                    />
                    <Route exact path="/register" component={RegisterPage} />

                    <Route exact path="/strains" component={Strains} />
                    <Route
                        exact
                        path="/strains/:id"
                        component={StrainDetails}
                    />

                    <Route exact path="/admin" component={AdminDashboard} />
                    <Route
                        exact
                        path="/admin/strains"
                        component={AdminStrains}
                    />
                    <Route
                        exact
                        path="/admin/strains/new"
                        component={CreateStrain}
                    />
                    <Route
                        exact
                        path="/admin/strains/edit/:id"
                        component={EditStrain}
                    />
                    <Route exact path="/admin/batches" component={Batches} />
                    <Route
                        exact
                        path="/admin/batches/new"
                        component={CreateBatch}
                    />
                    <Route
                        exact
                        path="/admin/batches/:id"
                        component={BatchDetails}
                    />
                    <Route
                        exact
                        path="/admin/batches/edit/:id"
                        component={EditBatch}
                    />

                    <Route exact path="/cart" component={CartIndex} />

                    <Route exact path="/forbidden" component={Forbidden} />
                    <Route component={NotFound} />
                </Switch>
            </Container>
        </BrowserRouter>
    );
};
