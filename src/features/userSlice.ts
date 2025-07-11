import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type customerInfos } from "./types";

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
  } as customerInfos,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    setCustomerInfo(state, action: PayloadAction<customerInfos>) {
      state.customerInfo = action.payload;
    },
    resetReservation(state) {
      state.customerInfo = {} as customerInfos;
    },
  },
});

export const { login, logout, setCustomerInfo, resetReservation } =
  userSlice.actions;
export default userSlice.reducer;
