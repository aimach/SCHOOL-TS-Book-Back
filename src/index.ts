import express from "express";
import cors from "cors";
import dataSource from "./utils";
import SkillController from "./controller/skill";
import WilderController from "./controller/wilder";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
// app.use((req: Request, res: Response, next) => {
//   let randomNb = Math.floor(Math.random() * 3);
//   if (randomNb === 2) {
//     console.log(req.socket.remoteAddress)
//     res.status(418).send("I'm a teapot");
//   } else {
//     next();
//   }
// });

// wilder
const wilderController = new WilderController();
app.get("/api/wilder", wilderController.read);
app.post("/api/wilder", wilderController.create);
app.post("/api/wilder/:idWilder", wilderController.addSkillToWilder);
app.put("/api/wilder/:id", wilderController.update);
app.delete("/api/wilder/:id", wilderController.delete);
app.delete(
  "/api/wilder/:idWilder/skill/:idSkill",
  wilderController.deleteSkillToWilder
);

// skill
const skillController = new SkillController();

app.get("/api/skill", skillController.read);
app.post("/api/skill", skillController.create);
app.put("/api/skill/:id", skillController.update);
app.delete("/api/skill/:id", skillController.delete);

const start = async (): Promise<void> => {
  await dataSource.initialize();
  app.listen(port, () => console.log("Server started on 5000"));
};

void start();
