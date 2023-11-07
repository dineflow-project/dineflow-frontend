import axios, { AxiosError } from 'axios';
import appConfig from "../configs/config";
import { Vendor } from '@/app/Interfaces/VendorInterface';



const VendorService = {
  getAllVendors: async (): Promise<Vendor[]> => {
    const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/vendors`);
    return response.data;
  },

  getVendorById: async (id: bigint): Promise<Vendor | null> => {
    try {
      const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/vendors/${id}`);
      return response.data[0];
    } catch (error: AxiosError | unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Vendor not found
      }
      throw error;
    }
  },

  getAllVendorsByCanteenId: async (canteenId: bigint): Promise<Vendor[]> => {
    const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/vendors/canteens/${canteenId}`);
    return response.data;
  },

  createVendor: async (vendor: Vendor): Promise<void> => {
    await axios.post(`${appConfig.BACKEND_BASE_URL}/vendors`, vendor);
  },

  deleteVendorById: async (id: bigint): Promise<void> => {
    await axios.delete(`${appConfig.BACKEND_BASE_URL}/vendors/${id}`);
  },

  updateVendorById: async (id: bigint, vendor: Vendor): Promise<void> => {
    await axios.put(`${appConfig.BACKEND_BASE_URL}/vendors/${id}`, vendor);
  },
};
export default VendorService;
