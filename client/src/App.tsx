import { StoreProvider } from "easy-peasy";
import { store } from "./store";
import { MainRouter } from "./MainRouter";

function App() {
    return (
        <StoreProvider store={store}>
            <MainRouter />
        </StoreProvider>
    );
}

export default App;
