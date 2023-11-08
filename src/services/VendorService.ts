import axios, { AxiosError } from 'axios';
import appConfig from "../configs/config";
import { Vendor } from '@/app/Interfaces/VendorInterface';
import { ApiErrorResponse, ApiResponse } from '@/Interfaces/ApiResponseInterface';
import { isResponseOk } from '@/utils/AppUtils';

const VendorService = {
  getAllVendors: async () => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/vendor`;
    const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Vendor[]>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

  getVendorById: async (id: bigint) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/vendor/${id}`;
    const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Vendor>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  getAllVendorsByCanteenId: async (canteenId: bigint) => {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/vendor/canteen/${canteenId}`;
    // const axios_res = await axios.get(path, { headers });
    const axios_res = await axios.get(path);
    const res = axios_res.data as ApiResponse<Vendor[]>;
    if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
    return res;
  },

  createVendor: async (vendor: Vendor)=> {
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/vendors`;
    // const axios_res = await axios.post(path, vendor, { headers });
    const axios_res = await axios.post(path, vendor);
    const res = axios_res.data as ApiResponse<Vendor>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

  deleteVendorById: async (id: bigint) => {
    // await axios.delete(`${appConfig.BACKEND_BASE_URL}/vendors/${id}`);
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/vendor/${id}`;
    // const axios_res = await axios.delete(path, { headers });
    const axios_res = await axios.delete(path);
    const res = axios_res.data as ApiResponse<Vendor>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
  },

  updateVendorById: async (id: bigint, vendor: Vendor)=> {
    // await axios.put(`${appConfig.BACKEND_BASE_URL}/vendors/${id}`, vendor);
    // const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/vendor/${id}`;
    // const axios_res = await axios.put(path, team, { headers });
    const axios_res = await axios.put(path, vendor);
    const res = axios_res.data as ApiResponse<Vendor>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
    },
};



export default VendorService;
