import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiAuth, PATH } from "../plugins/axios";

const initialState: OrderState = {
  odrders: [],
  pagination: {} as Pagination,
  loading: false,
  error: null,
};

export const getOdrders = createAsyncThunk(
  "odrders/getOdrders",
  async (page: number = 1) => {
    try {
      const res = await apiAuth.get(`/api/${PATH}/admin/orders?page=${page}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const editOrder = createAsyncThunk(
  "odrders/editOrder",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await apiAuth.put(`/api/${PATH}/admin/order/${data.id}`, {data});
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "odrders/delete",
  async (id: string) => {
    try {
      const { data } = await apiAuth.delete(`/api/${PATH}/admin/order/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const OrderSlice = createSlice({
  name: "odrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOdrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOdrders.fulfilled, (state, action) => {
        state.odrders = action.payload.orders;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(getOdrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "獲取失敗";
      });
  },
});

export default OrderSlice.reducer;

interface OrderState {
  odrders: any[];
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
