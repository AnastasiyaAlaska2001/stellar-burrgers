import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrdersApi } from '../utils/burger-api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TFeedState, TOrder, TOrdersData } from '@utils-types';

export type TExtendedFeedState = {
  userOrders: TOrder[];
} & TFeedState;

const initialState: TExtendedFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

// 1. Публичная лента заказов (/orders/all)
export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () =>
  getFeedsApi()
);

// 2. История заказов авторизованного пользователя (/orders)
export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => getOrdersApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Обработка публичной ленты заказов ---
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке ленты заказов';
      })

      // --- Обработка истории заказов пользователя ---
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          // getOrdersApi() возвращает сразу массив TOrder[]
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке истории заказов';
      });
  },
});

export default feedSlice.reducer;