import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userStore';
import productReducer from './productStore';
import receptionReducer from './receptionStore'
import couponReducer from './couponStore'
import messageReducer from './messageStore'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    reception: receptionReducer,
    message: messageReducer,
    coupon: couponReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;