import dataSource from "../utils";
import Wilder from "../entity/Wilder";
import Skill from "../entity/Skill";
import { Arg, Mutation, Query } from "type-graphql";

export class WildersResolvers {
  // get all wilders !
  @Query(() => [Wilder])
  async getAllWilders(): Promise<Wilder[]> {
    const allWilders = await dataSource.getRepository(Wilder).find();
    return allWilders;
  }

  // get a wilder by id
  @Query(() => Wilder)
  async getWilderById(@Arg("id") id: number): Promise<Wilder | null> {
    const wilderById = await dataSource.getRepository(Wilder).findOneBy({
      id: id,
    });
    return wilderById;
  }

  // add a wilder
  @Mutation(() => Wilder)
  async createWilder(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("description") description: string
  ): Promise<Wilder> {
    const wilderToCreate = new Wilder();
    wilderToCreate.name = name;
    wilderToCreate.email = email;
    wilderToCreate.description = description;
    return await dataSource.getRepository(Wilder).save(wilderToCreate);
  }

  // update a wilder
  @Mutation(() => Boolean)
  async updateWilder(
    @Arg("id") id: number,
    @Arg("name") name: string,
    @Arg("description") description: string
  ): Promise<boolean> {
    const wilderToUpdate = await dataSource
      .getRepository(Wilder)
      .findOneBy({ id: id });
    if (wilderToUpdate !== null) {
      await dataSource
        .getRepository(Wilder)
        .update(id, { name: name, description: description });
      return true;
    } else {
      return false;
    }
  }

  // delete a wilder
  @Mutation(() => Boolean)
  async deleteWilder(@Arg("id") id: number): Promise<boolean> {
    const wilderToDelete = await dataSource
      .getRepository(Wilder)
      .findOneBy({ id: id });
    if (wilderToDelete !== null) {
      await dataSource.getRepository(Wilder).delete(id);
      return true;
    } else {
      return false;
    }
  }

  // add skill to wilder
  @Mutation(() => Wilder)
  async addSkillToWilder(
    @Arg("idWilder") idWilder: number,
    @Arg("idSkill") idSkill: number
  ): Promise<Wilder | null> {
    const wilderToUpdate = await dataSource.getRepository(Wilder).findOneBy({
      id: idWilder,
    });
    const skillToAdd = await dataSource.getRepository(Skill).findOneBy({
      id: idSkill,
    });
    if (wilderToUpdate !== null && skillToAdd !== null) {
      wilderToUpdate.skills = [...wilderToUpdate.skills, skillToAdd];
      await dataSource.getRepository(Wilder).save(wilderToUpdate);
      return await dataSource.getRepository(Wilder).findOneBy({ id: idWilder });
    } else {
      return null;
    }
  }

  // delete skill to wilder
  @Mutation(() => Wilder)
  async deleteSkillToWilder(
    @Arg("idWilder") idWilder: number,
    @Arg("idSkill") idSkill: number
  ): Promise<Wilder | null> {
    const wilderToUpdate = await dataSource.getRepository(Wilder).findOneBy({
      id: idWilder,
    });
    const skillToDelete = await dataSource.getRepository(Skill).findOneBy({
      id: idSkill,
    });
    if (wilderToUpdate !== null && skillToDelete !== null) {
      const skillsToUpdate = wilderToUpdate.skills.filter(
        (skill) => skill.id !== skillToDelete.id
      );
      wilderToUpdate.skills = skillsToUpdate;
      await dataSource.getRepository(Wilder).save(wilderToUpdate);
      return await dataSource.getRepository(Wilder).findOneBy({
        id: idWilder,
      });
    } else {
      return null;
    }
  }

  // add an avatar
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: Upload
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }
}
