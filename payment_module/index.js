const logger = require("./utils/logger.js");
const app = require("./apis");
const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];
const PORT = config.port;
const mongoose = require("mongoose");
app.listen(PORT, () => {
  logger.info(`payment app is running mode :: ${env} :: listening at ${PORT}`);
});

connect()
  .then(() => {
    logger.info("connected to mongo db");
  })
  .catch((err) => {
    logger.error(`not connected to mongo db due to ${err}`);
  });

function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then((res, err) => {
        if (err) {
          console.log("not connected");
          return reject(err);
        }
        resolve(res);
      })
      .catch((err) => {
        logger.error(`not connected to mongo db due to ${err}`);
      });
  });
}
