import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userStore';
import productReducer from './productStore';
import receptionReducer from './receptionStore'
import messageReducer from './messageStore'

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    reception: receptionReducer,
    message: messageReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;