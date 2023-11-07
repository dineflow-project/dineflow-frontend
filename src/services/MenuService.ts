import axios, { AxiosError } from 'axios';
import appConfig from '../configs/config'; // Define your backend base URL in appConfig
import { Menu} from '@/app/Interfaces/MenuInterface';
import { Vendor } from '@/app/Interfaces/VendorInterface';
  
const MenuService = {
  getAllMenus: async (canteenId: bigint, vendorId: bigint, minprice: number, maxprice: number): Promise<Menu[]> => {
    try {
      const response = await axios.get<Menu[]>(
        `${appConfig.BACKEND_BASE_URL}/menus?canteen=${canteenId}&vendor=${vendorId}&minprice=${minprice}&maxprice=${maxprice}`
      );
      return response.data;
    } catch (error) {
        throw new Error("Failed to fetch all menu");
    }
  },
  getAllMenusByVendorId: async (vendorId: bigint): Promise<Menu[]> => {
    const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/menus/vendors/${vendorId}`);
    return response.data;
  },

  getMenuById: async (id: bigint): Promise<Menu | null> => {
    try {
      const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/menus/${id}`);
      return response.data;
    } catch (error: AxiosError | unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null; // Vendor not found
        }
        throw new Error("Failed to fetch menu");
      }
  },

  createMenu: async (menuRequest: Menu): Promise<void> => {
    try {
      await axios.post(`${appConfig.BACKEND_BASE_URL}/menus`, menuRequest);
    } catch (error) {
      throw error;
    }
  },

  deleteMenuById: async (id: bigint): Promise<void> => {
    try {
      await axios.delete(`${appConfig.BACKEND_BASE_URL}/menus/${id}`);
    } catch (error) {
      throw error;
    }
  },

  updateMenuById: async (id: bigint, updatedMenu: Menu): Promise<void> => {
    try {
      await axios.put(`${appConfig.BACKEND_BASE_URL}/menus/${id}`, updatedMenu);
    } catch (error) {
      throw error;
    }
  },
};

export default MenuService;
