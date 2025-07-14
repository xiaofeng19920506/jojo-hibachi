import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type customerInfos, type User } from "./types";

const initialState = {
  customerInfo: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    reservationDay: "",
    reservationMonth: "",
    reservationYear: "",
    date: "",
    time: "",
    transportationFee: 0,
    price: 0,
  } as customerInfos,
  user: {} as User,
  isAuthenticated: false,
  isInitialized: false, // Track if auth state has been initialized
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {} as User;
      state.isInitialized = true;
    },
    setCustomerInfo(state, action: PayloadAction<customerInfos>) {
      state.customerInfo = action.payload;
    },
    resetReservation(state) {
      state.customerInfo = {} as customerInfos;
    },
    initializeAuth: (
      state,
      action: PayloadAction<{ user: User; isAuthenticated: boolean }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isInitialized = true;
    },
  },
});

export const {
  login,
  logout,
  setCustomerInfo,
  resetReservation,
  initializeAuth,
} = userSlice.actions;
export default userSlice.reducer;
