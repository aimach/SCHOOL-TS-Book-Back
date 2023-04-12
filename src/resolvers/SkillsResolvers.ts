import dataSource from "../utils";
import Skill from "../entity/Skill";
import { Arg, Query, Mutation } from "type-graphql";

export class SkillsResolvers {
  @Query(() => [Skill])
  async getAllSkills(): Promise<Skill[]> {
    const allSkills = await dataSource.getRepository(Skill).find();
    return allSkills;
  }
  @Query(() => Skill)
  async getSkillById(@Arg("id") id: number): Promise<Skill | null> {
    const SkillById = await dataSource.getRepository(Skill).findOneBy({
      id: id,
    });
    return SkillById;
  }

  // add a skill
  @Mutation(() => Skill)
  async createSkill(@Arg("name") name: string): Promise<Skill> {
    const skillToCreate = new Skill();
    skillToCreate.name = name;
    return await dataSource.getRepository(Skill).save(skillToCreate);
  }

  // update a skill
  @Mutation(() => Boolean)
  async updateSkill(
    @Arg("id") id: number,
    @Arg("name") name: string
  ): Promise<boolean> {
    const skillToUpdate = await dataSource
      .getRepository(Skill)
      .findOneBy({ id: id });
    if (skillToUpdate !== null) {
      await dataSource.getRepository(Skill).update(id, { name: name });
      return true;
    } else {
      return false;
    }
  }

  // delete a skill
  @Mutation(() => Boolean)
  async deleteSkill(@Arg("id") id: number): Promise<boolean> {
    const skillToDelete = await dataSource
      .getRepository(Skill)
      .findOneBy({ id: id });
    if (skillToDelete !== null) {
      await dataSource.getRepository(Skill).delete(id);
      return true;
    } else {
      return false;
    }
  }
}
