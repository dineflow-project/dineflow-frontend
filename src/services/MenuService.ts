import axios, { AxiosError } from 'axios';
import appConfig from '../configs/config'; // Define your backend base URL in appConfig
import { Menu} from '@/app/Interfaces/MenuInterface';
import { Vendor } from '@/app/Interfaces/VendorInterface';
import { ApiErrorResponse, ApiResponse } from '@/Interfaces/ApiResponseInterface';
import { isResponseOk } from '@/utils/AppUtils';
  
const MenuService = {
  getAllMenus: async (canteenId: bigint, vendorId: bigint, minprice: number, maxprice: number) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu?canteen=${canteenId}&vendor=${vendorId}&minprice=${minprice}&maxprice=${maxprice}`;
    // const axios_res = await axios.get(path, { headers });
    const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Menu[]>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  getAllMenusByVendorId: async (vendorId: bigint) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu/byVendor/${vendorId}`;
    // const axios_res = await axios.get(path, { headers });
    const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Menu[]>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  getMenuById: async (id: bigint) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu/${id}`;
    // const axios_res = await axios.get(path, { headers });
    const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Menu>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  createMenu: async (menuRequest: Menu) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu`;
    // const axios_res = await axios.post(path, { headers });
    const axios_res = await axios.post(path, menuRequest);
    const res = axios_res.data as ApiResponse<Menu>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  deleteMenuById: async (id: bigint) => {
      // const headers = getEmptyHeaderWithBearerToken();
      const path = `${appConfig.BACKEND_API_URL}/menu/${id}`;
      // const axios_res = await axios.post(path, { headers });
      const axios_res = await axios.delete(path);
      const res = axios_res.data as ApiResponse<Menu>;
      if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
      }
      return res;
  },

  updateMenuById: async (id: bigint, updatedMenu: Menu) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/menu/${id}`;
    // const axios_res = await axios.post(path, { headers });
    const axios_res = await axios.put(path,updatedMenu);
    const res = axios_res.data as ApiResponse<Menu>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },
};

export default MenuService;
