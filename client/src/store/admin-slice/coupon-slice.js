import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";




export const fetchCoupons = createAsyncThunk('coupons/fetchCoupons', async ({ page, search }) => {
  const response = await api.get(`${API_ENDPOINTS.ADMIN.COUPONS}?page=${page}&search=${search}`, { withCredentials: true });
  return response.data;
});

export const addCoupon = createAsyncThunk('coupons/addCoupon', async (couponData, { dispatch }) => {
  const response = await api.post(API_ENDPOINTS.ADMIN.COUPONS, couponData, { withCredentials: true });
  dispatch(fetchCoupons({ page: 1, search: '' }));
  return response.data;
});

export const updateCoupon = createAsyncThunk('coupons/updateCoupon', async ({ id, couponData }, { dispatch }) => {
  const response = await api.put(API_ENDPOINTS.ADMIN.COUPON(id), couponData, { withCredentials: true });
  dispatch(fetchCoupons({ page: 1, search: '' }));
  return response.data;
});

export const deleteCoupon = createAsyncThunk('coupons/deleteCoupon', async (id, { dispatch }) => {
  await api.delete(API_ENDPOINTS.ADMIN.COUPON(id), { withCredentials: true });
  dispatch(fetchCoupons({ page: 1, search: '' }));
  return id;
});

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload.coupon);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(coupon => coupon._id === action.payload.coupon._id);
        if (index !== -1) {
          state.coupons[index] = action.payload.coupon;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
