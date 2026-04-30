import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";


const initialState = {
    user: null,
    addresses: [],
    isLoading: false,
    referralCode: null,
    appliedCode: null,
    applyResult: null,
    referredCount: 0,
    error: null,
};



const extractError = (error) => error.response?.data?.error || 'Something went wrong';

// Thunks
export const getUser = createAsyncThunk(
    "account/getUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.USER.BASE}/`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const updateUser = createAsyncThunk(
    "account/updateUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_ENDPOINTS.USER.BASE}/`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const updatePassword = createAsyncThunk(
    "account/updatePassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_ENDPOINTS.USER.BASE}/change-password`, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const fetchAddresses = createAsyncThunk(
    "account/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ENDPOINTS.USER.ADDRESSES, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const addAddress = createAsyncThunk(
    "account/addAddress",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.USER.ADDRESSES, data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const updateAddress = createAsyncThunk(
    "account/updateAddress",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(API_ENDPOINTS.USER.ADDRESS(id), data, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "account/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(API_ENDPOINTS.USER.ADDRESS(id), { withCredentials: true });
            return { _id: id };
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);


export const setDefault = createAsyncThunk(
    "account/setDefault",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.put(API_ENDPOINTS.USER.ADDRESS_SET_DEFAULT(id), {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(extractError(error));
        }
    }
);

export const getReferralCode = createAsyncThunk(
    "account/getReferralCode",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ENDPOINTS.USER.REFERRAL_CODE, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const applyReferralCode = createAsyncThunk(
    "account/applyReferralCode",
    async (referralCode, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.USER.APPLY_REFERRAL, { referralCode }, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const getReferredCount = createAsyncThunk(
    "account/getReferredCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ENDPOINTS.USER.REFERRED_COUNT, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // User reducers
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isLoading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            // Address reducers
            .addCase(fetchAddresses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                if (action.payload.isDefault) {
                    state.addresses = state.addresses.map((addr) => ({
                        ...addr,
                        isDefault: false,
                    }));
                }
                state.addresses.unshift(action.payload);
                state.isLoading = false;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.map((addr) =>
                    addr._id === action.payload._id
                        ? { ...addr, ...action.payload }
                        : { ...addr, isDefault: addr.isDefault && !action.payload.isDefault }
                );
                state.isLoading = false;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(
                    (addr) => addr._id !== action.payload._id
                );
                state.isLoading = false;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            .addCase(setDefault.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(setDefault.fulfilled, (state, action) => {
                state.addresses = state.addresses.map((addr) =>
                    addr._id === action.payload._id
                        ? { ...addr, ...action.payload }
                        : { ...addr, isDefault: false }
                );
                state.isLoading = false;
            })
            .addCase(setDefault.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(getReferralCode.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getReferralCode.fulfilled, (state, action) => {
                state.referralCode = action.payload.referralCode;
                state.appliedCode = action.payload.appliedCode;
                state.isLoading = false;
            })
            .addCase(getReferralCode.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(applyReferralCode.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(applyReferralCode.fulfilled, (state, action) => {
                state.appliedCode = action.meta.arg;
                state.applyResult = action.payload.message;
                state.isLoading = false;
            })
            .addCase(applyReferralCode.rejected, (state, action) => {
                state.applyResult = action.payload;
                state.isLoading = false;
            })
            .addCase(getReferredCount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getReferredCount.fulfilled, (state, action) => {
                state.referredCount = action.payload.referredCount;
                state.isLoading = false;
            })
            .addCase(getReferredCount.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { clearError, setLoading } = accountSlice.actions;
export default accountSlice.reducer;
