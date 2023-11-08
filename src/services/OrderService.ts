import axios from 'axios';
import { Order, OrderMenu } from '../Interfaces/OrderInterface';
import appConfig from '../configs/config'; // Define your backend base URL in appConfig
import { isResponseOk } from '@/utils/AppUtils';
import { ApiErrorResponse, ApiResponse } from '@/Interfaces/ApiResponseInterface';


export const OrderService = {
    getAllOrders: async(): Promise<Order[]> => {
        try {
      const response = await axios.get(`${appConfig.BACKEND_API_URL}/order`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  },

  // Add other methods using Axios for creating, updating, and deleting orders

  createOrder: async (orderRequest: Order) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/order`;
    // const axios_res = await axios.post(path, orderRequest, { headers });
    const axios_res = await axios.post(path, orderRequest);
    const res = axios_res.data as ApiResponse<Order>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

  

  updateOrder: async (id: string, orderData: any) : Promise<void> => {
    try {
      const response = await axios.put(`${appConfig.BACKEND_API_URL}/order/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update the order');
    }
  },

    deleteOrder:async (id: string): Promise<void> => {
    try {
      await axios.delete(`${appConfig.BACKEND_API_URL}/order/${id}`);
    } catch (error) {
      throw new Error('Failed to delete the order');
    }
  },

    getOrdersByVendorId:async(vendorId: string): Promise<void> => {
    try {
      const response = await axios.get(`${appConfig.BACKEND_API_URL}/order/byVendor/${vendorId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch orders by vendor');
    }
  },

    getOrdersByUserId:async(userId: string): Promise<void> => {
    try {
      const response = await axios.get(`${appConfig.BACKEND_API_URL}/order/byUser/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch orders by user');
    }
  }
}
export default OrderService;
