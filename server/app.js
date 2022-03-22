import path from "path";
import express from "express";
import hbs from "hbs";
import "./src/db/mongoose.js";
import userRouter from "./src/routers/user.js";
import productRouter from "./src/routers/products.js";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
import addDefaultAdmin from "./src/utils/defaultAdmin.js";
import supportChat from "./src/routers/support-chat.js";
import importIo from "./src/socket/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = importIo(new Server(server));

let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(cookieParser());
app.use(methodOverride("_method"));
const port = process.env.PORT || 3000;

//Define paths for express config
export const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Used files
app.use(express.json());
app.use(userRouter);
app.use(productRouter);
app.use(supportChat);
addDefaultAdmin();

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

export default app;
