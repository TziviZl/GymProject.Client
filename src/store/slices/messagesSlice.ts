import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactMessage } from '../../types';

interface MessagesState {
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMessages: (state, action: PayloadAction<ContactMessage[]>) => {
      state.messages = action.payload;
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<ContactMessage>) => {
      state.messages.push(action.payload);
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setMessages, addMessage, deleteMessage, setError } = messagesSlice.actions;
export default messagesSlice.reducer;