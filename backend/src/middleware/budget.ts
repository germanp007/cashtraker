import { param, body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("budgetId")
    .isInt()
    .withMessage("ID no valido")
    .custom((value) => value > 0)
    .withMessage("ID debe ser mayor a cero")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateBudgetExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "No se encontró el presupuesto" });
    }

    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ message: "Hubo un error" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del presupuesto no puede ir vacio")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("El valor del presupuesto no puede ir vacio")
    .isNumeric()
    .withMessage("El valor del presupuesto debe ser un número")
    .custom((value) => value > 0)
    .withMessage("El presupuesto debe ser mayor a 0")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
