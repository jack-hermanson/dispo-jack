import express from "express";
import bodyParser from "body-parser";
import * as http from "http";
import {mainRouter} from "./routes/mainRouter";
import {routePrefixes} from "./utils/constants";
import {config} from "dotenv";
import path from "path";
import {DbDialect} from "./utils/types";
import {ConnectionOptions, createConnection} from "typeorm";
import {Account} from "./entities/Account";
import {Role} from "./entities/Role";
import {Person} from "./entities/Person";
import {Accounts1621446055349} from "./migrations/1621446055349-Accounts";
import {roleRouter} from "./routes/roleRouter";
import {personRouter} from "./routes/personRouter";
import {accountRouter} from "./routes/accountRouter";

// env
const envPath = path.join(__dirname, "..", ".env");
config({path: envPath});
console.log(envPath);

// express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set("port", (process.env.PORT || 5000));

// express routes
app.use(routePrefixes.main, mainRouter);
app.use(routePrefixes.roles, roleRouter);
app.use(routePrefixes.people, personRouter);
app.use(routePrefixes.accounts, accountRouter);

// database
const databaseDialect: DbDialect = process.env.DATABASE_DIALECT as DbDialect;
export const dbOptions: ConnectionOptions = {
    database: databaseDialect === "sqlite" ? "site.db" : "",
    type: databaseDialect,
    url: process.env.DATABASE_URL,
    entities: [Role, Person, Account],
    synchronize: false,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    migrationsRun: true,
    migrationsTableName: "migrations",
    migrations: [Accounts1621446055349],
    cli: {
        migrationsDir: path.join(__dirname, "migrations")
    }
};
createConnection(dbOptions).then(connection => {
    console.log(`Connected to database type: ${connection.options.type}`);
}).catch(error => console.error(error));

// http server
const server: http.Server = http.createServer(app);

// listen
server.listen(app.get("port"), () => {
    console.log(`Server is listening on port ${app.get("port")}!`);
});
