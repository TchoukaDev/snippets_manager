import type { NextFunction, Request, Response } from "express"
import type { SnippetService } from "../services/SnippetService"


export class SnippetController {
    constructor(private readonly snippetService: SnippetService) { }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const snippets = await this.snippetService.getAll()
            res.json(snippets)
        } catch (error) {
            next(error)
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const snippet = await this.snippetService.getById(id)
            res.json(snippet)
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, content, format, categoryId, tagIds } = req.body
            const snippet = await this.snippetService.create(title, content, format, categoryId, tagIds ?? [])
            res.status(201).json(snippet)
        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const { title, content, format, categoryId, tagIds } = req.body
            const snippet = await this.snippetService.update(id, title, content, format, categoryId, tagIds ?? [])
            res.json(snippet)
        } catch (error) {
            next(error)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            await this.snippetService.delete(id)
            res.status(204).send()
        }
        catch (error) {
            next(error)
        }
    }
}
