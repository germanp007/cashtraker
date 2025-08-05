import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import {
  validateBudgetInput,
  validateBudgetExist,
  validateBudgetId,
} from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import {
  validateExpenseExist,
  validateExpenseId,
  validateExpenseInput,
} from "../middleware/expense";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// MiddleWares =======================================
router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExist);
router.param("expenseId", validateExpenseId);
router.param("expenseId", validateExpenseExist);

// ===================================================

router.get("/", BudgetController.getAll);

router.post("/", validateBudgetInput, BudgetController.create);

router.get("/:budgetId", BudgetController.getOne);

router.put("/:budgetId", validateBudgetInput, BudgetController.updateById);

router.delete("/:budgetId", BudgetController.deleteById);

// Router para los gastos

// router.get("/:budgetId/expenses", ExpensesController.getAll);

router.post(
  "/:budgetId/expenses",
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.create
);

router.get(
  "/:budgetId/expenses/:expenseId",
  validateExpenseId,
  ExpensesController.getById
);

router.put(
  "/:budgetId/expenses/:expenseId",
  validateExpenseId,
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.updateById
);

router.delete(
  "/:budgetId/expenses/:expenseId",
  validateExpenseId,
  ExpensesController.deleteById
);

export default router;
