import { config } from "dotenv";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { ConnectionOptions, createConnection } from "typeorm";
import { DbDialect } from "./utils/types";
import sslRedirect from "heroku-ssl-redirect";
import * as http from "http";
import * as socketio from "socket.io";
import { routePrefixes } from "./utils/constants";
import { models } from "./models/_models";
import { routes } from "./routes/_routes";
import { migrations } from "./migrations/_migrations";

// env
const envPath = path.join(__dirname, "..", ".env");
config({ path: envPath });
console.log(envPath);

// express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", process.env.PORT || 5000);

// ssl
app.use(sslRedirect(["production"]));

// static
const staticFiles = express.static(path.join(__dirname, "../../client/build"));
app.use(staticFiles);

// express routes
app.use(routePrefixes.roles, routes.roleRouter);
app.use(routePrefixes.people, routes.personRouter);
app.use(routePrefixes.accounts, routes.accountRouter);
app.use(routePrefixes.strains, routes.strainRouter);
app.use(routePrefixes.batches, routes.batchRouter);
app.use(routePrefixes.carts, routes.cartRouter);
app.use(routePrefixes.cartBatches, routes.cartBatchRouter);

// any apps not picked up by the server clients will be handled by the react router
app.use("/*", staticFiles);
app.set("port", process.env.PORT || 5000);

// database
const databaseDialect: DbDialect = process.env.DATABASE_DIALECT as DbDialect;
export const dbOptions: ConnectionOptions = {
    database: databaseDialect === "sqlite" ? "site.db" : "",
    type: databaseDialect,
    url: process.env.DATABASE_URL,
    entities: models,
    synchronize: false,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    migrationsRun: true,
    migrationsTableName: "migrations",
    migrations: migrations,
    cli: {
        migrationsDir: path.join(__dirname, "migrations"),
    },
};
createConnection(dbOptions)
    .then(connection => {
        console.log(`Connected to database type: ${connection.options.type}`);
    })
    .catch(error => console.error(error));

// http server and socket
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server({
    cors: {
        origin: "*",
    },
});
io.attach(server);
app.set("socketio", io);

io.on("connection", (socket: socketio.Socket) => {
    console.log("new socket connection on back end");
    socket.emit("status", "New connection made");
    socket.on("disconnect", () => console.log("connection broken"));
});

// listen
server.listen(app.get("port"), () => {
    console.log(`Server is listening on port ${app.get("port")}!`);
});
