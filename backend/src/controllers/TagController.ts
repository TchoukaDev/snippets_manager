import type { NextFunction, Request, Response } from "express";
import type { TagService } from "../services/TagService";

export class TagController {
    constructor(private readonly tagService: TagService) { }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tags = await this.tagService.getAll()
            res.json(tags)
        } catch (error) {
            next(error)
        }
    }
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const tag = await this.tagService.getById(id)
            res.json(tag)
        } catch (error) {
            next(error)
        }
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body
            const tag = await this.tagService.create(name)
            res.status(201).json(tag)
        } catch (error) {
            next(error)
        }
    }
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const { name } = req.body
            const tag = await this.tagService.update(id, name)
            res.json(tag)
        } catch (error) {
            next(error)
        }
    }
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            await this.tagService.delete(id)
        } catch (error) {
            next(error)
        }
    }

}