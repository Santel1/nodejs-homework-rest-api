const app = require("./app");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({
  path:
    process.env.NODE_ENV === "development"
      ? "./envs/dev.env"
      : "./envs/prod.env",
});

mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
console.log(process.env.NODE_ENV);

const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`);
});
