import { Router } from "express";
import { SnippetRepository } from "../repositories/SnippetRepository";
import { SnippetService } from "../services/SnippetService";
import { TagService } from "../services/TagService";
import { TagRepository } from "../repositories/TagRepository";
import { SnippetController } from "../controllers/SnippetController";

const router = Router()

const snippetRepository = new SnippetRepository()
const tagRepository = new TagRepository()
const tagService = new TagService(tagRepository)
const snippetService = new SnippetService(snippetRepository, tagService)
const snippetController = new SnippetController(snippetService)

router.get("/", snippetController.getAll)
router.get("/:id", snippetController.getById)
router.post("/", snippetController.create)
router.put("/:id", snippetController.update)
router.delete("/:id", snippetController.delete)
router.post("/:id/tags", snippetController.addTag)
router.delete("/:id/tags", snippetController.removeTag)

export default router