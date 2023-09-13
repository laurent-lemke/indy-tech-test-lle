import express, { Express } from "express";
import http from "node:http";
import { randomBytes } from "node:crypto";
import session from "express-session";
import * as OpenApiValidator from "express-openapi-validator";
import path from "node:path";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import promocodes from "./promocodes";
import { transformErrorToHttpCode } from "./utils/error";

const createLocalServer = (app: Express, ip: string, port: number) => {
  // we could use https but this would requires to create self-signed certificate.
  // That is not the goal of the exercise
  http.createServer();
  const server = http.createServer(app);
  server.listen(port, ip, () => {
    console.log("Server listening, see doc on http://%s:%s/spec/", ip, port);
  });
  server.on("error", (err) => {
    console.error(
      "Failed to start server on %s:%s. Reason: %s",
      ip,
      port,
      err.message,
    );
  });
};

// Define cookie/session used for authentication
const setupAuthenticatedApp = async (app) => {
  app.disable("x-powered-by");
  const cookie = {
    secure: "auto",
    sameSite: true,
  };
  app.use(
    session({
      name: "sid",
      resave: true,
      secret: randomBytes(64).toString("hex"),
      saveUninitialized: true,
      cookie,
    }),
  );
  // After this line we could use an authentication middleware such as Passport
};

const setupOpenApi = (app: Express) => {
  const apiSpec = path.join(".", "api.yaml");
  const fileContent = readFileSync(apiSpec, "utf8");
  const swaggerDocument = YAML.parse(fileContent);

  app.use("/spec", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(
    OpenApiValidator.middleware({
      apiSpec,
    }),
  );
};

// define all API routes
const initRoutes = (app: Express) => {
  const PATHS = [
    {
      path: "/api/v1/promocodes",
      router: promocodes,
    },
  ];
  for (const path of PATHS) {
    app.use(path.path, path.router);
    app.use(transformErrorToHttpCode);
  }
};

export const startWebserver = async (ip: string, port: number) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  await setupAuthenticatedApp(app);
  setupOpenApi(app);
  createLocalServer(app, ip, port);
  initRoutes(app);
};
