const serverConfig = {
  appName: process.env.PROJECT_NAME ?? "Default name",
  environment: process.env.NODE_ENV ?? "development",
  port: process.env.PORT ? +process.env.PORT : 3000,
  mongoUrl: process.env.MONGO_URL ?? "mongodb://localhost:27017",
  jwtSecret: process.env.JWT_SECRET ?? "secret-phrase",
  jwtExpires: process.env.JWT_EXPIRES ?? "1d",
};

module.exports = serverConfig;
