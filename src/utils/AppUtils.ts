import { ApiResponse } from "../Interfaces/ApiResponseInterface";

export const addHoursToDate = (d: Date, h: number) => {
    d.setTime(d.getTime() + (h*60*60*1000));
    return d
}
export const getErrorMessage = (error: unknown): string => {
    let errorMessage = "";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    } else {
        errorMessage = "Unknown error";
    }
    return errorMessage;
}

export const isResponseOk = (response: ApiResponse): boolean => {
    if (response.code.slice(0, 2) === "20") {
        return true;
    } else {
        return false;
    }
}

export const getEmptyHeaderWithBearerToken = (): any => {
    // console.log("Roleeee",sessionStorage.getItem("role"))
    // console.log("Tokennnnn",sessionStorage.getItem("accessToken"))

    return sessionStorage.getItem("accessToken") != undefined ?  { 'Authorization' : `Bearer ${sessionStorage.getItem("accessToken")}`} : {}
}