import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
      });
      res
        .status(200)
        .json({ message: "Presupuesto creado correctamente", data: budgets });
    } catch (error) {
      res.status(500).json({ message: "Hubo un error" });
    }
  };
  static getOne = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense],
    });
    console.log(budget);
    res.json({ data: budget });
  };
  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      await budget.save();
      res.status(201).json({ message: "Presupuesto creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Hubo un error" });
    }
  };
  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    res.json({ message: "Presupuesto actualizado correctamente" });
  };
  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy();

    res.json({ message: "Presupuesto eliminado correctamente" });
  };
}
