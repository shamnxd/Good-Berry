import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";




export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.USER.WALLET, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createWalletRazorpayOrder = createAsyncThunk(
  'wallet/createWalletRazorpayOrder',
  async ({ amount }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.USER.WALLET_CREATE_RAZORPAY_ORDER, { amount }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyWalletPayment = createAsyncThunk(
  'wallet/verifyWalletPayment',
  async ({ razorpayPaymentId, razorpayOrderId, razorpaySignature, amount }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.USER.WALLET_VERIFY_PAYMENT, { razorpayPaymentId, razorpayOrderId, razorpaySignature, amount }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USER.WALLET_TRANSACTIONS}?page=${page}&limit=${limit}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    transactions: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyWalletPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyWalletPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
      })
      .addCase(verifyWalletPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default walletSlice.reducer;
