import express from "express";
import cors from "cors";
import dataSource from "./utils";
import multer from "multer";
import SkillController from "./controller/skill";
import WilderController from "./controller/wilder";
const { ApolloServer, gql } = require("apollo-server");
import Wilder from "./entity/Wilder";
import Skill from "./entity/Skill";

// const app = express();
// const port = 5000;
// const upload = multer({ dest: "uploads/" });

// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// wilder
// const wilderController = new WilderController();
// app.get("/api/wilder", wilderController.read);
// app.post("/api/wilder", wilderController.create);
// app.post("/api/wilder/:idWilder", wilderController.addSkillToWilder);
// app.put(
//   "/api/wilder/:idWilder/avatar",
//   upload.single("avatar"),
//   wilderController.addAvatarToWilder
// );
// app.put("/api/wilder/:id", wilderController.update);
// app.delete("/api/wilder/:id", wilderController.delete);
// app.delete(
//   "/api/wilder/:idWilder/skill/:idSkill",
//   wilderController.deleteSkillToWilder
// );

// skill
// const skillController = new SkillController();

// app.get("/api/skill", skillController.read);
// app.post("/api/skill", skillController.create);
// app.put("/api/skill/:id", skillController.update);
// app.delete("/api/skill/:id", skillController.delete);

// const start = async (): Promise<void> => {
//   await dataSource.initialize();
//   app.listen(port, () => console.log(`Server started on ${port}`));
// };

// void start();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Wilder {
    id: ID
    name: String
    email: String
    description: String
    avatar: String
    # skills: [Skill]
  }

  type Skill {
    id: ID
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    wilders: [Wilder]
    skills: [Skill]
  }
`;

const resolvers = {
  Query: {
    wilders: async () => {
      try {
        const WilderToRead = await dataSource.getRepository(Wilder).find();
        return WilderToRead;
      } catch (err) {
        console.log(err);
      }
    },
    skills: async () => {
      try {
        const SkillToRead = await dataSource.getRepository(Skill).find();
        return SkillToRead;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   **/
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen().then(({ url }: { url: string }) => {
  dataSource.initialize();
  console.log(`🚀  Server ready at ${url}`);
});
