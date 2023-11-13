import axios from "axios";
import { ApiLoginResponse, ApiErrorResponse, ApiResponse } from "../Interfaces/ApiResponseInterface";
import appConfig from "../configs/config";
import { isResponseOk } from "../utils/AppUtils";
import { UserInterface } from "../Interfaces/UserInterface";
import { addHoursToDate } from "../utils/AppUtils";

export const login = async (email: string, password: string) => {
    const path = `${appConfig.BACKEND_API_URL}/api/auth/login`;
    let axios_res = await axios.post(path, {
        email: email,
        password: password,
    });
    const res = axios_res.data as ApiLoginResponse;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    if(res.token !=null){
        sessionStorage.setItem("accessToken", res.token)
        sessionStorage.setItem("token_expires", addHoursToDate(new Date(), 1).toString())
    }
    if(res.data != null) {
        sessionStorage.setItem("userId", res.data.id)
        sessionStorage.setItem("role", res.data.role)
        sessionStorage.setItem("name", res.data.name)
        sessionStorage.setItem("email", res.data.name)
    }
    // console.log("login api",sessionStorage)
    return res;

    // const UserPath = `${appConfig.BACKEND_API_URL}/${res.data?.id}`;
    // const VendorPath = `${appConfig.BACKEND_BASE_URL}/vendor/userId/${res.data?.id}`;
}

export const createUser = async (name: string, email: string, password: string, confirmPassword:string) => {
    const path = `${appConfig.BACKEND_API_URL}/api/auth/register`;
    const payload = {
        name: name,
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
        role: "user"
    };
    const axios_res = await axios.post(path, payload);
    const res = axios_res.data as ApiResponse<UserInterface>;
    if(!isResponseOk(res)) {
        throw new ApiErrorResponse(res.code, res.error ?? "Unknown error");
    }
    return res;
}

