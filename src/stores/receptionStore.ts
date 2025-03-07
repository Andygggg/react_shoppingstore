import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, PATH } from "../plugins/axios";

interface simpleProduct {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  description: string;
  origin_price: number;
  price: number;
}

interface ProductState {
  goodsList: any[];
  cartList: any[];
  goods: simpleProduct;
  currentProduct: any;
  cart: {
    items: any[];
  };
  pagination: {
    current_page: number;
    total_pages: number;
  };
  loading: boolean;
  error: string | null;
  loadingCartId: string | null;
}

const initialState: ProductState = {
  goodsList: [],
  cartList: [],
  goods: {} as simpleProduct,
  currentProduct: null,
  cart: {
    items: [],
  },
  pagination: {
    current_page: 1,
    total_pages: 1,
  },
  loading: false,
  error: null,
  loadingCartId: null,
};

export const getClientProducts = createAsyncThunk(
  "shopping/getClientProducts",
  async (page: number = 1) => {
    try {
      const res = await api.get(`/api/${PATH}/products?page=${page}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getClientProduct = createAsyncThunk(
  "shopping/getClientProduct",
  async (id: string) => {
    try {
      const res = await api.get(`/api/${PATH}/product/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getClientCart = createAsyncThunk(
  "shopping/getClientCart",
  async () => {
    try {
      const res = await api.get(`/api/${PATH}/cart`);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addToCart = createAsyncThunk(
  "shopping/addToCart",
  async ({ id, qty }: { id: string; qty: number }) => {
    try {
      const res = await api.post(`/api/${PATH}/cart`, {
        data: {
          product_id: id,
          qty,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "shopping/updateCartItem",
  async ({
    id,
    product_id,
    qty,
  }: {
    id: string;
    product_id: string;
    qty: number;
  }) => {
    try {
      const res = await api.put(`/api/${PATH}/cart/${id}`, {
        data: {
          product_id,
          qty,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const delGoods = createAsyncThunk(
  "shopping/delGoods",
  async (id: string) => {
    try {
      const res = await api.delete(`/api/${PATH}/cart/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const delAllCart = createAsyncThunk("shopping/delAllCart", async () => {
  try {
    const res = await api.delete(`/api/${PATH}/carts`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
});

export const orderCart = createAsyncThunk(
  "shopping/orderCart",
  async (data: any) => {
    try {
      const res = await api.post(`/api/${PATH}/order`, {
        data: { user: data, message: data.message },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const productSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientProducts.fulfilled, (state, action) => {
        state.goodsList = action.payload.products;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(getClientProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(getClientCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientCart.fulfilled, (state, action) => {
        state.cartList = action.payload.carts;
        state.loading = false;
      })
      .addCase(getClientCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(getClientProduct.fulfilled, (state, action) => {
        state.goods = action.payload.product;
      })

      .addCase(delGoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(delGoods.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(delGoods.rejected, (state) => {
        state.loading = false;
      })

      .addCase(delAllCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(delAllCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(delAllCart.rejected, (state) => {
        state.loading = false;
      })

      .addCase(orderCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(orderCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(orderCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
