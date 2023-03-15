import { DataSource } from "typeorm";
import Wilder from "./entity/Wilder";
import Skill from "./entity/Skill";

const dataSource = new DataSource({
  type: "sqlite",
  database: "./wildersdb.sqlite",
  synchronize: true,
  entities: [Wilder, Skill],
  logging: ["query", "error"],
});

export default dataSource;
