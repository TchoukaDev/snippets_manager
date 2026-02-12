import { Router } from "express";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryService } from "../services/CategoryService";
import { CategoryController } from "../controllers/CategoryController";

const router = Router()

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)
const categoryController = new CategoryController(categoryService)

router.get("/", categoryController.getAll)
router.get("/:id", categoryController.getById)
router.post("/", categoryController.create)
router.put("/:id", categoryController.update)
router.delete("/:id", categoryController.delete)

export default router