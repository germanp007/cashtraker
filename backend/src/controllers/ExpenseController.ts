import type { Request, Response } from "express";
import Expense from "../models/Expense";
import Budget from "../models/Budget";

export class ExpensesController {
  //   static getAll = async (req: Request, res: Response) => {};

  static create = async (req: Request, res: Response) => {
    try {
      const expense = new Expense(req.body);
      expense.budgetId = req.budget.id;
      await expense.save();
      res.status(201).json({ message: "Gasto creado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un Error" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { expenseId, budgetId } = req.params;

    const expense = await Expense.findOne({
      where: {
        id: expenseId, // ID específico del expense
        budgetId: budgetId, // Solo del budget correspondiente
      },
      include: [Budget],
    });

    if (!expense) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }

    res.json(expense);
  };

  static updateById = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    res.json({ message: "El presupuesto se actualizo correctamente" });
  };

  static deleteById = async (req: Request, res: Response) => {
    await req.expense.destroy();
    res.json({ message: "El presupuesto se elimino correctamente" });
  };
}
