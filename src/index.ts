import "dotenv/config";
import { startWebserver } from "./presentation/rest/app";

const DEFAULT_PORT = 3000;

const main = async () => {
  const ip = "127.0.0.1";
  const port = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;
  startWebserver(ip, port);
};

main();
