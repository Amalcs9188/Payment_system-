import { z } from "zod";

export const formSchema = z.object({
  openingCash: z.coerce.number().min(1, "Opening cash is required"),
  counterCash: z.coerce.number().min(1, "Counter cash is required"),
  expense: z.coerce.number().min(0, "Expense must be non-negative").optional(),
  upiCash: z.coerce.number().min(1, "UPI cash is required"),
  cardCash: z.coerce.number().min(1, "Card cash is required"),
  other: z.coerce.number().min(0, "Other cash must be a non-negative number"),
  note500: z.coerce.number().min(0, "Count must be a non-negative number"),
  note200: z.coerce.number().min(0, "Count must be a non-negative number"),
  note100: z.coerce.number().min(0, "Count must be a non-negative number"),
  note50: z.coerce.number().min(0, "Count must be a non-negative number"),
  note20: z.coerce.number().min(0, "Count must be a non-negative number"),
  note10: z.coerce.number().min(0, "Count must be a non-negative number"),
});