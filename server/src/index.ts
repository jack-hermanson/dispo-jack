import express from "express";
import bodyParser from "body-parser";
import * as http from "http";
import {mainRouter} from "./routes/mainRouter";
import {routePrefixes} from "./utils/constants";

// express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set("port", (process.env.PORT || 5000));

// express routes
app.use(routePrefixes.main, mainRouter);

// http server
const server: http.Server = http.createServer(app);

// listen
server.listen(app.get("port"), () => {
    console.log(`Server is listening on port ${app.get("port")}!`);
});
