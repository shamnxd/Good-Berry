import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
}

export const registerUser = createAsyncThunk(
    "/auth/register",

    async (formData) => {
        const response = await api.post(
            `${API_ENDPOINTS.AUTH.REGISTER}`,
            formData,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const loginUser = createAsyncThunk(
    "/auth/login",

    async (formData) => {
        const response = await api.post(
            `${API_ENDPOINTS.AUTH.LOGIN}`,
            formData,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const checkAuth = createAsyncThunk(
    "/auth/checkauth",

    async () => {
        const response = await api.post(`${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {},
            {
                withCredentials: true,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
            }
        );

        return response.data;
    }
);

export const logoutUser = createAsyncThunk(
    "/auth/logout",

    async () => {
        const response = await api.post(
            `${API_ENDPOINTS.AUTH.LOGOUT}`,
            {},
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otp) => {
    const response = await api.post(
      `${API_ENDPOINTS.AUTH.VERIFY}`,
      otp,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
)

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async () => {
    const response = await api.post(
      `${API_ENDPOINTS.AUTH.RESEND_OTP}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
)

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email, thunkAPI) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.AUTH.FORGET_PASSWORD}`, { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, { token, password });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: () => {
            
         }
    },
    extraReducers: (builder) => {
        builder

            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
            }).addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false,
                    state.user = null,
                    state.isAuthenticated = false
            }).addCase(registerUser.rejected, (state) => {
                state.isLoading = false,
                    state.user = null,
                    state.isAuthenticated = false
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;