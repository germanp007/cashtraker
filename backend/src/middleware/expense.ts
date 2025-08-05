import { body, validationResult, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import Expense from "../models/Expense";

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("expenseId")
    .isInt()
    .withMessage("ID no valido")
    .custom((value) => value > 0)
    .withMessage("ID no valido")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateExpenseExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "No se encontró el Gasto" });
    }

    req.expense = expense;
    next();
  } catch (error) {
    res.status(500).json({ message: "Hubo un error" });
  }
};
export const validateExpenseInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del gasto no puede ir vacio")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("El valor del gasto no puede ir vacio")
    .isNumeric()
    .withMessage("El valor del gasto debe ser un número")
    .custom((value) => value > 0)
    .withMessage("El gasto debe ser mayor a 0")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
