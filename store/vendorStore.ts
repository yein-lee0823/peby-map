import { create } from "zustand";
import { VendorsListDto } from "@/api/dto/vendors.dto";

interface VendorsState {
  vendors: VendorsListDto[];
  setVendors: (list: VendorsListDto[]) => void;
}

export const useVendorsStore = create<VendorsState>((set) => ({
  vendors: [],
  setVendors: (list) =>
    set({
      vendors: list,
    }),
}));