const dotenv = require("dotenv");

dotenv.config({
  path:
    process.env.NODE_ENV === "development"
      ? "./envs/dev.env"
      : "./envs/prod.env",
});

const app = require("./app");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Database connection successful"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

console.log(process.env.NODE_ENV);

const port = process.env.PORT ?? 4000;

module.exports = app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`);
});
