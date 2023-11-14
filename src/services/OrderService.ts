import axios from 'axios';
import { Order, OrderMenu } from '../Interfaces/OrderInterface';
import appConfig from '../configs/config'; // Define your backend base URL in appConfig
import { getEmptyHeaderWithBearerToken, isResponseOk } from '@/utils/AppUtils';
import { ApiErrorResponse, ApiResponse } from '@/Interfaces/ApiResponseInterface';


const OrderService = {
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
    const headers = getEmptyHeaderWithBearerToken();
    // console.log('Headerrrr',headers);
    const path = `${appConfig.BACKEND_API_URL}/order`;
    const axios_res = await axios.post(path, orderRequest, { headers });
    // const axios_res = await axios.post(path, orderRequest);
    const res = axios_res.data as ApiResponse<Order>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

  

  updateOrder: async (id: string, orderData: any) => {
    const headers = getEmptyHeaderWithBearerToken();
    // console.log('Headerrrr',headers);
    const path = `${appConfig.BACKEND_API_URL}/order/${id}`;
    const axios_res = await axios.put(path, orderData, { headers });
    // const axios_res = await axios.post(path, orderRequest);
    const res = axios_res.data as ApiResponse<Order>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

    deleteOrder:async (id: string) => {
    const headers = getEmptyHeaderWithBearerToken();
    // console.log('Headerrrr',headers);
    const path = `${appConfig.BACKEND_API_URL}/order/${id}`;
    const axios_res = await axios.delete(path, { headers });
    // const axios_res = await axios.post(path, orderRequest);
    const res = axios_res.data as ApiResponse<Order>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

  getOrdersByVendorId: async (vendorId: string)=> {
      const headers = getEmptyHeaderWithBearerToken();
      // console.log('Headerrrr',headers);
      const path = `${appConfig.BACKEND_API_URL}/order/byVendor/${vendorId}`;
      const axios_res = await axios.get(path, { headers });
      // const axios_res = await axios.post(path, orderRequest);
      const res = axios_res.data as ApiResponse<Order[]>;
      if(!isResponseOk(res)) {
          throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
      }
      return res;
    },
  getOrdersByUserId: async (userId: string)=> {
    const headers = getEmptyHeaderWithBearerToken();
    // console.log('Headerrrr',headers);
    const path =(`${appConfig.BACKEND_API_URL}/order/byUser/${userId}`);
    const axios_res = await axios.get(path, { headers });
    // const axios_res = await axios.post(path, orderRequest);
    const res = axios_res.data as ApiResponse<Order[]>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
   return res;
  },
};

export default OrderService;
