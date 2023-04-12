import dataSource from "./utils";
const { ApolloServer } = require("apollo-server");
import { buildSchema } from "type-graphql";
import { WildersResolvers } from "./resolvers/WildersResolvers";
import { SkillsResolvers } from "./resolvers/SkillsResolvers";

const start = async (): Promise<void> => {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [WildersResolvers, SkillsResolvers],
  });
  const server = new ApolloServer({
    schema,
  });
  try {
    const { url } = await server.listen({ port: 5000 });
    console.log(`Server ready at ${url}`);
  } catch {
    console.log("Error starting the server");
  }
};
void start();
