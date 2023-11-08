import axios from 'axios';
import appConfig from "../configs/config";
import { Canteen } from '../Interfaces/CanteenInterface';
import { getEmptyHeaderWithBearerToken, isResponseOk } from "../utils/AppUtils";
import { ApiErrorResponse, ApiResponse } from '../Interfaces/ApiResponseInterface';


export const getAllCanteens = async () => {
  // const headers = getEmptyHeaderWithBearerToken();
  const path = `${appConfig.BACKEND_API_URL}/canteen`;
  const axios_res = await axios.get(path);
  const res = axios_res.data as ApiResponse<Canteen[]>;
  if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
}

export const getCanteenByID = async (canteenId: bigint) => {
  // const headers = getEmptyHeaderWithBearerToken();
  const path = `${appConfig.BACKEND_API_URL}/canteen/${canteenId}`;
  // const axios_res = await axios.get(path, { headers });
  const axios_res = await axios.get(path);
  const res = axios_res.data as ApiResponse<Canteen>;
  if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
}
export const createCanteen = async (name: string) => {
  const path = `${appConfig.BACKEND_API_URL}/canteen`;
  const axios_res = await axios.post(path, {"Name":name});
  const res = axios_res.data as ApiResponse<Canteen>;
  if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
}

export const updateCanteenById = async (id: bigint, name:string) => {
  // const headers = getEmptyHeaderWithBearerToken();
  const path = `${appConfig.BACKEND_API_URL}/canteen/${id}`;
  // const axios_res = await axios.put(path, name, { headers });
  const axios_res = await axios.put(path, {"Name":name});
  const res = axios_res.data as ApiResponse<Canteen>;
  if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
}
export const deleteCanteenById = async (id: string) => {
  // const headers = getEmptyHeaderWithBearerToken();
  const path = `${appConfig.BACKEND_API_URL}/canteen/${id}`;
  // const axios_res = await axios.delete(path, { headers });
  const axios_res = await axios.delete(path);
  const res = axios_res.data as ApiResponse<Canteen>;
  if(!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
}
