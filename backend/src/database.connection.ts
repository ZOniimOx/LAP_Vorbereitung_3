import { DataSource } from "typeorm";
import * as entities from "./models";

export const appDbDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "lapvorbereitung",
  password: "lapvorbereitung",
  database: "lap_vorbereitung_3",
  entities: entities,
  logging: true,
  synchronize: true,
});

// export const dsDatabase = dbConnection.initialize();

export async function createDBConnection(): Promise<DataSource> {
  await appDbDataSource.initialize();

  return appDbDataSource;
}
