// // redux/features/auth/authSlice.ts

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },

//     clearUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice} from "@reduxjs/toolkit";
import type {PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "LEADER" | "SETTER" | "CLOSER" | "INSTALLER" | "CLIENT";
  organization?:string,
  isApproved?:boolean,
  commission_balance?:number,
  certifications?:[string]
}

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading:boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading:true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false
    },
    setLoading:(state,action:PayloadAction<boolean>)=>{
      state.isLoading = action.payload
    }
  },
});

export const { setUser, clearUser,setLoading } = authSlice.actions;
export default authSlice.reducer;