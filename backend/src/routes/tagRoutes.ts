import { Router } from "express";
import { TagRepository } from "../repositories/TagRepository";
import { TagService } from "../services/TagService";
import { TagController } from "../controllers/TagController";

const router = Router()

const tagRepository = new TagRepository()
const tagService = new TagService(tagRepository)
const tagController = new TagController(tagService)

router.get("/", tagController.getAll)
router.get('/:id', tagController.getById)
router.post("/", tagController.create)
router.put("/:id", tagController.update)
router.delete("/:id", tagController.delete)

export default router