import { api } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { DailyDataItem } from "./page";
import { SERVER_URL } from './../../../../server_url';







export interface DailySalesReport {
  date: string;           // ISO date string, e.g., "2025-06-12"
  closing_cash: number;   // Cash at closing
  opening_cash: number;   // Cash at opening
  counter_cash: number;   // Cash received at counter
  expense: number;        // Expenses during the day
  upi_cash: number;       // UPI payments
  card_cash: number;      // Card payments
}



export const useDailyData = () => {
    return useQuery(
        {
            queryKey: ['dailyData'],
            queryFn: async () => {
                const res = await api.get(`${SERVER_URL}/api/daily`)
                return res.data
            }
        }
    )
}

export const useDailyDataUpdate = () => {
    return useMutation({
        mutationFn: async (data: DailySalesReport) => {
            const res = await api.post(`${SERVER_URL}/api/daily`, data);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            
        },
        onError: (error) => {
            toast.error(error.message);
        },

    })
}

export const useDailyDataEdit = () => {
   const  queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: DailyDataItem) => {
            const res = await api.put(`${SERVER_URL}/api/daily`, data, { params: { id: data._id } });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['dailyData'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    })
}
export const useDailyDelete = () =>{
    const  queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`${SERVER_URL}/api/daily`, { params: { id } });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['dailyData'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    })
}