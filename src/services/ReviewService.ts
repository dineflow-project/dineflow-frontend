import axios from 'axios';
import appConfig from '../configs/config';
import { Review } from '../Interfaces/ReviewInterface';
import { ApiErrorResponse, ApiResponse } from '@/Interfaces/ApiResponseInterface';
import { getEmptyHeaderWithBearerToken, isResponseOk } from '../utils/AppUtils';

const ReviewService = {
  getReviewById: async (id: string) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/review/${id}`;
    const axiosRes = await axios.get(path, { headers });
    const res = axiosRes.data as ApiResponse<Review>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },

  getReviewByVendorId: async (vendorId: string) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/review/byVendor/${vendorId}`;
    const axiosRes = await axios.get(path, { headers });
    const res = axiosRes.data as ApiResponse<Review[]>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },

  getAvgReviewScoreByVendorId: async (vendorId: string) => {
    const headers = getEmptyHeaderWithBearerToken();
    // http://localhost:8000/review/avgScore/1
    const path = `${appConfig.BACKEND_API_URL}/review/avgScore/${vendorId}`;
    const axiosRes = await axios.get(path, { headers });
    const res = axiosRes.data as ApiResponse<number>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },

  getAllReviews: async () => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/review`;
    const axiosRes = await axios.get(path, { headers });
    const res = axiosRes.data as ApiResponse<Review[]>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },

  createReview: async (reviewRequest: Review) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/review`;
    const axiosRes = await axios.post(path, reviewRequest, { headers });
    const res = axiosRes.data as ApiResponse<Review>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },

  updateReviewById: async (id: string, updatedReview: Review) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/review/${id}`;
    const axiosRes = await axios.put(path, updatedReview, { headers });
    const res = axiosRes.data as ApiResponse<Review>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },

  deleteReviewById: async (id: string) => {
    const headers = getEmptyHeaderWithBearerToken();
    const path = `${appConfig.BACKEND_API_URL}/reviews/${id}`;
    const axiosRes = await axios.delete(path, { headers });
    const res = axiosRes.data as ApiResponse<Review>;
    if (!isResponseOk(res)) {
      throw new ApiErrorResponse(res.code, res.error ?? 'Unknown error');
    }
    return res;
  },
};

export default ReviewService;
