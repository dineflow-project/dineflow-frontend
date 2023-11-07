import axios from 'axios';
import appConfig from "../configs/config";


export interface Canteen {
  id: number;
  name: string;
}

export const CanteenService = {
  getAllCanteens: async (): Promise<Canteen[]> => {
    try {
      const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/canteens`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCanteenByID: async (canteenId: number): Promise<Canteen> => {
    try {
      const response = await axios.get(`${appConfig.BACKEND_BASE_URL}/canteens/${canteenId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCanteen: async (canteenData: Canteen): Promise<void> => {
    try {
      await axios.post(`${appConfig.BACKEND_BASE_URL}/canteens`, canteenData);
    } catch (error) {
      throw error;
    }
  },

  updateCanteen: async (canteenId: number, updatedCanteen: Canteen): Promise<void> => {
    try {
      await axios.put(`${appConfig.BACKEND_BASE_URL}/canteens/${canteenId}`, updatedCanteen);
    } catch (error) {
      throw error;
    }
  },

  deleteCanteen: async (canteenId: number): Promise<void> => {
    try {
      await axios.delete(`${appConfig.BACKEND_BASE_URL}/canteens/${canteenId}`);
    } catch (error) {
      throw error;
    }
  },
};
