import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, apiAuth } from "../plugins/axios";

const initialState: UserState = {
  username: "",
  password: "",
  token: null,
  isLoggedIn: false,
  loading: false,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (user: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/signin", user);
      const { token } = res.data;
      sessionStorage.setItem("access_token", token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error || "登入失敗");
    }
  }
);

export const checkLoginStatus = createAsyncThunk(
  "user/checkStatus",
  async () => {
    try {
      const res = await apiAuth.post("/api/user/check");
      return res.data.success;
    } catch (error) {
      console.log(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      sessionStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isLoggedIn = action.payload.success;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

interface UserState {
  username: string;
  password: string;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
}
