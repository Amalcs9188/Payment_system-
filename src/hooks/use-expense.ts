import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useExpense = () => {
    return useQuery(
        {
            queryKey: ['expense'],
            queryFn: async () => {
                const res = await api.get('/api/expense')
                return res.data
            }
        }
    )
}
export interface expenstPost {
    date: string;
    category: string;
    amount: number;
    description: string;
}

export const useExpensePost = () => {
    const queryClient = useQueryClient();
   return useMutation({
       mutationFn: async (data:expenstPost ) => {
           const res = await api.post('/api/expense', data)
           return res.data
       },
       onSuccess: () => {
        toast.success('Expense record created successfully');
        queryClient.invalidateQueries({ queryKey: ['expense'] });
       }
   })
}