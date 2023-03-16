import { app } from "./app";
import { dsDatabase } from "./database.connection";

dsDatabase
  .then(() => {
    app.listen(3000, () => {
      console.log("App listning on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
