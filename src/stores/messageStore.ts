import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Message {
  id: string;
  type: 'success' | 'danger';
  text: string;
}

export const messageSlice = createSlice({
  name: 'message',
  initialState: [] as Message[],
  reducers: {
    createMessage(state, action) {
      if (action.payload.success) {
        state.push({
          id: action.payload.id,
          type: 'success',
          text: action.payload.message as string,
        });
      } else {
        state.push({
          id: action.payload.id,
          type: 'danger',
          text: Array.isArray(action.payload.message)
            ? action.payload.message.join('、')
            : action.payload.message as string,
        });
      }
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

interface AsyncMessagePayload {
  success: boolean;
  message: string | string[];
}

export const openMessage = createAsyncThunk<void, AsyncMessagePayload>(
  'message/openMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(
      messageSlice.actions.createMessage({
        ...payload,
        id: requestId,
      })
    );

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 2000);
  }
);

export const { createMessage } = messageSlice.actions;

export default messageSlice.reducer;