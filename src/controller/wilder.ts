import { Request, Response } from "express";
import dataSource from "../utils";
import Skill from "../entity/Skill";
import Wilder from "../entity/Wilder";

interface aWilder {
  id: number;
  name: string;
  email: string;
  description: string;
  skills: object[];
}

export default class WilderController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const test = await dataSource
        .getRepository(Wilder)
        .count({ where: { email: req.body.email } });
      if (test > 0) {
        res.status(403).send("Email already exist");
      } else {
        const request = await dataSource.getRepository(Wilder).save(req.body);
        res.status(201).send({ id: request.id });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while creating wilder");
    }
  }

  async read(req: Request, res: Response): Promise<void> {
    try {
      const WilderToRead: aWilder[] = await dataSource
        .getRepository(Wilder)
        .find();
      res.status(200).send(WilderToRead);
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while reading wilders");
    }
  }

  async update(req: Request<{ id: number }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const existingUser = await dataSource
        .getRepository(Wilder)
        .findOneBy({ id });
      if (existingUser === null) {
        res.status(404).send("Wilder not found");
      }
      await dataSource
        .getRepository(Wilder)
        .update(req.params.id, { name: req.body.name });
      res.status(200).send("Updated wilder");
    } catch (err) {
      res.status(400).send("Error while updating wilder");
    }
  }

  async delete(req: Request<{ id: number }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const existingUser = await dataSource
        .getRepository(Wilder)
        .findOneBy({ id });
      if (existingUser === null) {
        res.status(404).send("Wilder not found");
      }
      await dataSource.getRepository(Wilder).delete(id);
      res.status(200).send("Deleted wilder");
    } catch (err) {
      res.status(404).send("Error while deleting wilder");
    }
  }

  async addSkillToWilder(
    req: Request<{ idWilder: number }>,
    res: Response
  ): Promise<void> {
    try {
      const { idWilder } = req.params;
      const wilderToUpdate = await dataSource
        .getRepository(Wilder)
        .findOneBy({ id: idWilder });
      if (wilderToUpdate == null) {
        res.status(404).send("Wilder not found");
      }
      console.log(req.body);
      req.body.skills.forEach(async (e: number) => {
        const skillToAdd = await dataSource
          .getRepository(Skill)
          .findOneBy({ id: e });
        if (skillToAdd == null) {
          res.status(404).send("Skill not found");
        }
        if (wilderToUpdate !== null && skillToAdd !== null) {
          wilderToUpdate.skills = [...wilderToUpdate.skills, skillToAdd];
          await dataSource.getRepository(Wilder).save(wilderToUpdate);
          res.status(200).send("Skill added to wilder");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("Error while creating skill");
    }
  }

  async deleteSkillToWilder(
    req: Request<{ idWilder: number; idSkill: number }>,
    res: Response
  ): Promise<void> {
    try {
      const { idWilder, idSkill } = req.params;
      const wilderToUpdate = await dataSource
        .getRepository(Wilder)
        .findOneBy({ id: idWilder });
      if (wilderToUpdate == null) {
        res.status(404).send("Wilder not found");
      }
      const skillToDelete = await dataSource
        .getRepository(Skill)
        .findOneBy({ id: idSkill });
      if (skillToDelete == null) {
        res.status(404).send("Skill not found");
      }
      if (wilderToUpdate !== null) {
        const skillsToUpdate = wilderToUpdate.skills.filter(
          (skill) => skill.id !== idSkill
        );
        wilderToUpdate.skills = skillsToUpdate;
        await dataSource.getRepository(Wilder).save(wilderToUpdate);
        res.status(200).send("Skill deleted");
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while creating skill");
    }
  }
}
