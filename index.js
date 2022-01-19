import { rootGet } from "./controllers/rootController.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", rootGet);

app.use(globalErrorHandler);

// printenv | grep PORT -> grep is a feature for searching through large pieces of text.
app.listen(process.env.PORT || 3001, () => {
    console.log("Server has started on port", process.env.PORT);
})