import { Router } from "express";
import { getCategories, getArticlesByCategoryId } from "../controllers/articleController.js";

const categoryRouter = Router();
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id/articles", getArticlesByCategoryId);

export default categoryRouter;
