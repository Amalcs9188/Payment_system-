import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";


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