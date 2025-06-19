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
    id?: string;
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

export const useExpenseDelete = () => {
    const queryClient = useQueryClient();
   return useMutation({
       mutationFn: async (id:string) => {
           const res = await api.delete('/api/expense',{
               params: {
                   id
               }
           })
           return res.data
       },
       onSuccess: () => {
        toast.success('Expense record deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['expense'] });
       }
   })
}

export const useExpenseEdit = () => {
    const queryClient = useQueryClient();
   return useMutation({
       mutationFn: async (data:expenstPost ) => {
           const res = await api.put('/api/expense', data,{
               params: {
                   id:data.id
               }
           })
           return res.data
       },
       onSuccess: () => {
        toast.success('Expense record updated successfully');
        queryClient.invalidateQueries({ queryKey: ['expense'] });
       }
   })
}