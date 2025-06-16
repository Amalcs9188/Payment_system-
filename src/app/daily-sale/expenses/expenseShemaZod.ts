import z from "zod";

export const expenceShemaZod = z.object({
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.coerce.number().min(1, "Amount is required"),
})

export type ExpenseshemaZod = z.infer<typeof expenceShemaZod>;