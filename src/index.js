import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDb()
  .then((res) => {
    const PORT = process.env.PORT || 3000;

    app.on("error", (error) => {
      console.log("Error ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed: ", error.message);
  });
