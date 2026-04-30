import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";




const cartStorage = {
  load: () => {
    try {
      const cartItems = localStorage.getItem('cartItems');
      return cartItems ? JSON.parse(cartItems) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  },
  save: (items) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart from storage:', error);
    }
  }
};

export const syncCartAfterLogin = createAsyncThunk(
  'cart/syncCartAfterLogin',
  async () => {
    const localCart = cartStorage.load();

    if (localCart.length === 0) {
      return;
    }

    try {
      const response = await api.post(API_ENDPOINTS.USER.CART_SYNC, localCart, {
        withCredentials: true,
      });

      cartStorage.clear();

      return response.data;
    } catch (error) {
      console.error('Error syncing cart after login:', error);
      throw error;
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const { auth } = getState();

    if (!auth.user) {
      return cartStorage.load();
    }

    try {
      const response = await api.get(API_ENDPOINTS.USER.CART, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartItem, { getState }) => {
    const { auth } = getState();
    const itemToAdd = { ...cartItem };

    if (!auth.user) {
      delete itemToAdd.userId;
      const currentCart = cartStorage.load();
      const existingItemIndex = currentCart.findIndex(
        item => item.productId === itemToAdd.productId &&
          item.packageSize === itemToAdd.packageSize &&
          item.flavor === itemToAdd.flavor
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = currentCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      } else {
        updatedCart = [...currentCart, itemToAdd];
      }

      cartStorage.save(updatedCart);
      return updatedCart;
    }

    try {
      const response = await api.post(API_ENDPOINTS.USER.CART, itemToAdd, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity, packageSize, flavor }, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.user) {
      const currentCart = cartStorage.load();
      const updatedCart = currentCart.map(item =>
        item.productId === itemId &&
          item.packageSize === packageSize &&
          item.flavor === flavor
          ? { ...item, quantity }
          : item
      );
      cartStorage.save(updatedCart);
      return updatedCart;
    }

    try {
      const response = await api.put(API_ENDPOINTS.USER.CART_ITEM(itemId), {
        quantity,
        packageSize,
        flavor
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to update quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ itemId, packageSize, flavor }, { getState }) => {
    const { auth } = getState();

    if (!auth.user) {
      const currentCart = cartStorage.load();
      const updatedCart = currentCart.filter(
        item => !(item.productId === itemId &&
          item.packageSize === packageSize &&
          item.flavor === flavor)
      );
      cartStorage.save(updatedCart);
      return { itemId, packageSize, flavor };
    }

    try {
      await api.delete(API_ENDPOINTS.USER.CART_ITEM(itemId), {
        data: { packageSize, flavor },
        withCredentials: true,
      });
      return { itemId, packageSize, flavor };
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
);

export const checkQuantity = createAsyncThunk(
  'cart/checkQuantity',
  async (input) => {
    try {
      const isBulk = Array.isArray(input);
      const payload = isBulk ? { items: input } : input;
      
      const response = await api.post(`${API_ENDPOINTS.CHECK_QUANTITY.BASE}`, 
        payload, 
        { withCredentials: true }
      );
      
      return {
        isBulk,
        data: response.data,
        originalInput: input
      };
    } catch (error) {
      console.error('Error checking quantity:', error);
      throw error;
    }
  }
);


export const getCoupons = createAsyncThunk(
  'cart/getCoupons',
  async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.COUPONS, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error checking quantity:', error);
      throw error;
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    coupons: [],
    availableQuantities: {}, 
    quantityLoading: false, 
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.availableQuantities = {};
      cartStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(syncCartAfterLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
        }
        state.error = null;
      })
      .addCase(syncCartAfterLogin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.availableQuantities = {};
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { itemId, packageSize, flavor } = action.payload;
        state.items = state.items.filter(
          item => !(item.productId === itemId &&
            item.packageSize === packageSize &&
            item.flavor === flavor)
        );
        state.availableQuantities = {};
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.availableQuantities = {};
      })
      .addCase(checkQuantity.pending, (state) => {
        state.quantityLoading = true;
        state.error = null;
      })
      .addCase(checkQuantity.fulfilled, (state, action) => {
        const { isBulk, data } = action.payload;
        
        if (isBulk) {
          data.forEach(result => {
            if (!result.error) {
              const { productId, packageSize, flavor, quantity, availableQuantity, currentCartQuantity } = result;
              state.availableQuantities[`${productId}-${packageSize}-${flavor}`] = {
                total: quantity,
                available: availableQuantity,
                inCart: currentCartQuantity
              };
            }
          });
        } else {
          const { productId, packageSize, flavor, quantity, availableQuantity, currentCartQuantity } = data;
          state.availableQuantities[`${productId}-${packageSize}-${flavor}`] = {
            total: quantity,
            available: availableQuantity,
            inCart: currentCartQuantity
          };
        }
        
        state.quantityLoading = false;
        state.error = null;
      })
      .addCase(checkQuantity.rejected, (state, action) => {
        state.quantityLoading = false;
        state.error = action.error.message;
      })
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;