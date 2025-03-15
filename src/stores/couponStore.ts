import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiAuth, PATH } from "../plugins/axios";

import type { Coupon } from "@/typings";

const initialState: CouponState = {
  coupons: [],
  pagination: {} as Pagination,
  loading: false,
  error: null,
};

export const getCoupons = createAsyncThunk(
  "coupons/getCoupons",
  async (page: number = 1) => {
    try {
      const res = await apiAuth.get(`/api/${PATH}/admin/coupons?page=${page}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addCoupon = createAsyncThunk(
  "coupons/addCoupon",
  async (data: Coupon, { rejectWithValue }) => {
    try {
      const res = await apiAuth.post(`/api/${PATH}/admin/coupon`, { data });
      console.log(res.data);
      
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCoupon = createAsyncThunk(
  "coupons/editCoupon",
  async (data: Coupon, { rejectWithValue }) => {
    try {
      const res = await apiAuth.put(`/api/${PATH}/admin/coupon/${data.id}`, { data });
      console.log(res.data);
      
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (id: string) => {
    try {
      const { data } = await apiAuth.delete(`/api/${PATH}/admin/coupon/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const CouponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload.coupons;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "獲取失敗";
      });
  },
});

export default CouponSlice.reducer;

interface CouponState {
  coupons: Coupon[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

interface Pagination {
  total_pages: number;
  current_page: number;
  has_pre: boolean;
  has_next: boolean;
  category: string;
}
