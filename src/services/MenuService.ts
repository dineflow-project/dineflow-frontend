import axios, { AxiosError } from 'axios';
import appConfig from '../configs/config'; // Define your backend base URL in appConfig
import { Menu} from '../Interfaces/MenuInterface';
import { Vendor } from '../Interfaces/VendorInterface';
import { ApiErrorResponse, ApiResponse } from '@/Interfaces/ApiResponseInterface';
import { getEmptyHeaderWithBearerToken, isResponseOk } from "../utils/AppUtils";
  
const MenuService = {
  getAllMenus: async (canteenId: bigint, vendorId: bigint, minprice?: number, maxprice?: number) => {
    const headers = getEmptyHeaderWithBearerToken();
    // http://localhost:8000/menu?canteenId=1&vendorId=3&minprice&maxprice=
    const path = `${appConfig.BACKEND_API_URL}/menu?canteenId=${canteenId}&vendorId=${vendorId}&minprice=${minprice}&maxprice=${maxprice}`;
    // console.log('path',path)
    const axios_res = await axios.get(path, { headers });
    // const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Menu[]>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  getAllMenusByVendorId: async (vendorId: bigint) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu/byVendor/${vendorId}`;
    const axios_res = await axios.get(path, { headers });
    // const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Menu[]>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  getMenuById: async (id: bigint) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu/${id}`;
    const axios_res = await axios.get(path, { headers });
    // const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Menu>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  createMenu: async (menuRequest: Menu) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu`;
    const axios_res = await axios.post(path, menuRequest, { headers });
    // const axios_res = await axios.post(path, menuRequest);
    const res = axios_res.data as ApiResponse<Menu>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  deleteMenuById: async (id: bigint) => {
      const headers = getEmptyHeaderWithBearerToken();
      const path = `${appConfig.BACKEND_API_URL}/menu/${id}`;
      const axios_res = await axios.delete(path, { headers });
      // const axios_res = await axios.delete(path);
      const res = axios_res.data as ApiResponse<Menu>;
      if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
      }
      return res;
  },

  updateMenuById: async (id: bigint, updatedMenu: Menu) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu/${id}`;
    const axios_res = await axios.put(path, updatedMenu, { headers });
    const res = axios_res.data as ApiResponse<Menu>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },
};

export default MenuService;
