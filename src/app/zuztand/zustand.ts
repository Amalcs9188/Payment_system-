import { create } from "zustand";

export type head_type = {
  head_data: string;
  sethead_data: (newHeadData: string[]) => void;
  removeAllBears: () => void;
};

export const useHeadStore = create<head_type>()((set) => ({
  head_data: "",
  sethead_data: (newHeadData) => set({ head_data: newHeadData[0] }),
  removeAllBears: () => set({ head_data: "" }),
}));
