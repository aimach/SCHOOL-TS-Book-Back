import { Request, Response } from "express";
import dataSource from "../utils";
import Skill from "../entity/Skill";

// all done
export default class SkillController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      await dataSource.getRepository(Skill).save(req.body);
      res.status(201).send("Created skill");
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT") {
        res.status(409).send("Skill already exists");
      }
      res.status(400).send("Something went wrong");
    }
  }

  async read(req: Request, res: Response): Promise<void> {
    try {
      const skillToRead = await dataSource.getRepository(Skill).find();
      res.status(200).send(skillToRead);
    } catch (err) {
      console.error("error", err);
      res.status(400).send("Error while reading skills");
    }
  }

  async update(req: Request<{ id: number }>, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const existingSkill = await dataSource
        .getRepository(Skill)
        .findOneBy({ id });
      if (existingSkill === null) {
        return res.status(404).send("Skill not found");
      }
      await dataSource.getRepository(Skill).update(id, { name: req.body.name });
      res.status(200).send("Updated skill");
    } catch (err) {
      res.status(400).send("Error while updating skill");
    }
  }

  async delete(req: Request<{ id: number }>, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const existingSkill = await dataSource
        .getRepository(Skill)
        .findOneBy({ id });
      if (existingSkill === null) {
        return res.status(404).send("Skill not found");
      }
      await dataSource.getRepository(Skill).delete(id);
      res.status(200).send("Deleted skill");
    } catch (err) {
      res.status(400).send("Error while deleting skill");
    }
  }
}
