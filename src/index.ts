import express from "express";
import cors from "cors";
import dataSource from "./utils";
import multer from "multer";
import SkillController from "./controller/skill";
import WilderController from "./controller/wilder";

const app = express();
const port = 5000;
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// wilder
const wilderController = new WilderController();
app.get("/api/wilder", wilderController.read);
app.post("/api/wilder", wilderController.create);
app.post("/api/wilder/:idWilder", wilderController.addSkillToWilder);
app.put(
  "/api/wilder/:idWilder/avatar",
  upload.single("avatar"),
  wilderController.addAvatarToWilder
);
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
  app.listen(port, () => console.log(`Server started on ${port}`));
};

void start();
