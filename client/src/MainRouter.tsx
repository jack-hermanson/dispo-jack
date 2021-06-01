import {BrowserRouter, Route} from "react-router-dom";
import {Navigation} from "./components/Navigation/Navigation";
import {Container} from "reactstrap";
import {Account} from "./components/Account/Account";
import {LoginPage} from "./components/Account/LoginPage";
import {useEffect} from "react";
import {useStoreActions} from "./store";
import {Dashboard} from "./components/Dashboard/Dashboard";
import {Strains} from "./components/Strains/Strains";
import {StrainDetails} from "./components/Strains/StrainDetails";
import {AdminDashboard} from "./components/Admin/AdminDashboard";
import {CreateStrain} from "./components/Strains/Admin/CreateStrain";
import {AdminStrains} from "./components/Strains/Admin/AdminStrains";
import {Alerts} from "./components/Alerts/Alerts";
import {EditStrain} from "./components/Strains/Admin/EditStrain";

export const MainRouter = () => {

    const fetchStrainTypes = useStoreActions(actions => actions.fetchStrainTypes);
    const fetchStrains = useStoreActions(actions => actions.fetchStrains);
    const fetchBatches = useStoreActions(actions => actions.fetchBatches);

    useEffect(() => {
        fetchStrainTypes();
        fetchStrains();
        fetchBatches();
    });

    return (
        <BrowserRouter>
            <Navigation />
            <Container className="mb-3">
                <Alerts />
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/account/login" component={LoginPage} />
                <Route exact path="/strains" component={Strains} />
                <Route exact path="/strains/:id" component={StrainDetails} />
                <Route exact path="/admin" component={AdminDashboard} />
                <Route exact path="/admin/strains" component={AdminStrains} />
                <Route exact path="/admin/strains/new" component={CreateStrain} />
                <Route exact path="/admin/strains/edit/:id" component={EditStrain} />
            </Container>
        </BrowserRouter>
    );
}
