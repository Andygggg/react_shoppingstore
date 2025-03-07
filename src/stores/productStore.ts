import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, apiAuth, PATH } from "../plugins/axios";

const initialState: ProductState = {
  products: [],
  pagination: {} as Pagination,
  loading: false,
  error: null,
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (page: number = 1) => {
    try {
      const res = await apiAuth.get(`/api/${PATH}/admin/products?page=${page}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id: string) => {
    try {
      const res = await api.get(`/api/${PATH}/product/${id}`);
      return res.data.product;
    } catch (error) {
      console.log(error);
    }
  }
);

export const uploadProduct = createAsyncThunk(
  "products/upload",
  async (productData: Product, { rejectWithValue }) => {
    try {
      const res = await apiAuth.post(`/api/${PATH}/admin/product`, {
        data: productData,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, data }: { id: string; data: Product }) => {
    try {
      const res = await apiAuth.put(`api/${PATH}/admin/product/${id}`, {
        data,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    try {
      const { data } = await apiAuth.delete(`/api/${PATH}/admin/product/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const uploadImg = createAsyncThunk(
  "products/uploadImg",
  async (file: any) => {
    try {
      const formData = new FormData();
  formData.append("file-to-upload", file);
      const { data } = await apiAuth.post(`/api/${PATH}/admin/upload`, formData);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "獲取產品失敗";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "刪除失敗";
      });
  },
});

export default productSlice.reducer;

export interface Product {
  category: string;
  content: string;
  description: string;
  is_enabled: number;
  origin_price: number;
  price: number;
  title: string;
  unit: string;
  imageUrl: string;
  imagesUrl: string[];
  saveYear?: number;
}

export interface Products {
  id: string;
  category: string;
  content: string;
  description: string;
  is_enabled: number;
  origin_price: number;
  price: number;
  title: string;
  unit: string;
  num: number;
  imageUrl: string;
  imagesUrl: string[];
}

interface ProductState {
  products: Products[];
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
