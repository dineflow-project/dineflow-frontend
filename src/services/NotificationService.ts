import axios from "axios";
import { Notification } from "../Interfaces/NotiInterface";
import {
  ApiResponse,
  ApiErrorResponse,
} from "../Interfaces/ApiResponseInterface";
import appConfig from "../configs/config";
import { getEmptyHeaderWithBearerToken, isResponseOk } from "../utils/AppUtils";

export const GetAllNotifiactions = async (recipientID: string) => {
  const headers = getEmptyHeaderWithBearerToken();
  const path = `${appConfig.BACKEND_API_URL}/notification/${recipientID}`;
  console.log(path);
//   /notification/:recipientID
  const axios_res = await axios.get(path, { headers });
  const res = axios_res.data as ApiResponse<Notification[]>;
  if (!isResponseOk(res)) {
    throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
};

export const GetUnreadNotification = async (id: string) => {
  const headers = getEmptyHeaderWithBearerToken();
  const path = `${appConfig.BACKEND_API_URL}/notification/unread//${id}`;
  const axios_res = await axios.get(path, { headers });
  const res = axios_res.data as ApiResponse<null>;
  if (!isResponseOk(res)) {
    throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
  }
  return res;
};