import type { NextFunction, Request, Response } from "express";
import type { CategoryService } from "../services/CategoryService";

export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.getAll()
            res.json(categories)
        } catch (error) {
            next(error)
        }
    }
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const category = await this.categoryService.getById(id)
            res.json(category)
        } catch (error) {
            next(error)
        }
    }
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body
            const category = await this.categoryService.create(name)
            res.status(201).json(category)
        } catch (error) {
            next(error)
        }
    }
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const { name } = req.body
            const category = await this.categoryService.update(id, name)
            res.json(category)
        } catch (error) {
            next(error)
        }
    }
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            await this.categoryService.delete(id)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

}