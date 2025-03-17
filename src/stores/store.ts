import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userStore';
import productReducer from './productStore';
import receptionReducer from './receptionStore'
import couponReducer from './couponStore'
import orderReducer from './orderStore'
import messageReducer from './messageStore'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    reception: receptionReducer,
    message: messageReducer,
    coupon: couponReducer,
    order: orderReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;