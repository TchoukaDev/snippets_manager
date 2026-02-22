import { Router } from "express";
import { SnippetRepository } from "../repositories/SnippetRepository";
import { SnippetService } from "../services/SnippetService";
import { SnippetController } from "../controllers/SnippetController";

const router = Router()

const snippetRepository = new SnippetRepository()
const snippetService = new SnippetService(snippetRepository)
const snippetController = new SnippetController(snippetService)

router.get("/", snippetController.getAll)
router.get("/:id", snippetController.getById)
router.post("/", snippetController.create)
router.put("/:id", snippetController.update)
router.delete("/:id", snippetController.delete)

export default router
