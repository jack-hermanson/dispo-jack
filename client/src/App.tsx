import { StoreProvider } from "easy-peasy";
import { _store } from "./stores/_store";
import { MainRouter } from "./MainRouter";

function App() {
    return (
        <StoreProvider store={_store}>
            <MainRouter />
        </StoreProvider>
    );
}

export default App;
