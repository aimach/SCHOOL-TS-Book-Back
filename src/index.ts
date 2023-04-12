import dataSource from "./utils";
import multer from "multer";
const { ApolloServer, gql } = require("apollo-server");
import Wilder from "./entity/Wilder";
import Skill from "./entity/Skill";

const typeDefs = gql`
  type Wilder {
    id: ID
    name: String
    email: String
    description: String
    avatar: String
    skills: [Skill]
  }

  type Skill {
    id: ID
    name: String
  }

  # GET
  type Query {
    getAllWilders: [Wilder]
    getWilderById(id: ID): Wilder
    getAllSkills: [Skill]
    getSkillById(id: ID): Skill
  }
  # POST-PATCH-PUT-DELETE
  type Mutation {
    createWilder(name: String, email: String, description: String): Wilder
    updateWilder(
      id: ID
      name: String
      email: String
      description: String
    ): Wilder
    deleteWilder(id: ID): Boolean
    createSkill(name: String): Skill
    updateSkill(id: ID, name: String): Skill
    deleteSkill(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    getAllWilders: async () => {
      try {
        const allWilders = await dataSource.getRepository(Wilder).find();
        return allWilders;
      } catch (err) {
        console.log(err);
      }
    },
    getWilderById: async (_: any, args: { id: number }) => {
      try {
        const wilderById = await dataSource.getRepository(Wilder).findOneBy({
          id: args.id,
        });
        return wilderById;
      } catch (err) {
        console.log(err);
      }
    },

    getAllSkills: async () => {
      try {
        const SkillToRead = await dataSource.getRepository(Skill).find();
        return SkillToRead;
      } catch (err) {
        console.log(err);
      }
    },
    getSkillById: async (_: any, args: { id: number }) => {
      try {
        const skillById = await dataSource.getRepository(Skill).findOneBy({
          id: args.id,
        });
        return skillById;
      } catch (err) {
        console.log(err);
      }
    },
  },

  Mutation: {
    createWilder: async (
      _: any,
      args: { name: string; email: string; description: string }
    ) => {
      const wilderToCreate = new Wilder();
      wilderToCreate.name = args.name;
      wilderToCreate.email = args.email;
      wilderToCreate.description = args.description;
      return await dataSource.getRepository(Wilder).save(wilderToCreate);
    },
    updateWilder: async (
      _: any,
      args: { id: number; name: string; description: string }
    ) => {
      const wilderToUpdate = await dataSource.getRepository(Wilder).findOneBy({
        id: args.id,
      });
      if (wilderToUpdate !== null) {
        await dataSource
          .getRepository(Wilder)
          .update(args.id, { name: args.name, description: args.description });
        return await dataSource.getRepository(Wilder).findOneBy({
          id: args.id,
        });
      } else {
        return false;
      }
    },

    deleteWilder: async (_: any, args: { id: number }) => {
      const wilderToDelete = await dataSource.getRepository(Wilder).findOneBy({
        id: args.id,
      });
      if (wilderToDelete !== null) {
        await dataSource.getRepository(Wilder).delete(args.id);
        return true;
      } else {
        return false;
      }
    },

    createSkill: async (_: any, args: { name: string }) => {
      const skillToCreate = new Skill();
      skillToCreate.name = args.name;
      return await dataSource.getRepository(Skill).save(skillToCreate);
    },
    updateSkill: async (_: any, args: { id: number; name: string }) => {
      const skillToUpdate = await dataSource.getRepository(Skill).findOneBy({
        id: args.id,
      });
      if (skillToUpdate !== null) {
        await dataSource
          .getRepository(Skill)
          .update(args.id, { name: args.name });
        return await dataSource.getRepository(Skill).findOneBy({
          id: args.id,
        });
      } else {
        return false;
      }
    },
    deleteSkill: async (_: any, args: { id: number }) => {
      const skillToDelete = await dataSource.getRepository(Skill).findOneBy({
        id: args.id,
      });
      if (skillToDelete !== null) {
        await dataSource.getRepository(Skill).delete(args.id);
        return true;
      } else {
        return false;
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
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen().then(({ url }: { url: string }) => {
  dataSource.initialize();
  console.log(`🚀  Server ready at ${url}`);
});
