import { app } from "./app";
import { createDBConnection } from "./database.connection";
import logger from "./logger.service";

const port: number = 3000;

createDBConnection()
  .then(() => {
    app.listen(port, () => {
      logger.info("App listning on port " + port);
    });
  })
  .catch((err) => {
    console.error(err);
  });
