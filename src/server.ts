import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const ENVIRONMENT = process.env.NODE_ENV;

app.listen(PORT, () => {
    console.log(
        `Server listening in ${ENVIRONMENT} environment on Port ${PORT}`,
    );
});
