import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authlice";
import api from "./service/api";
import AuthApi from "./service/authApi";
import {AtolyeApi} from "./service/atolyeApi";
import {UsersApi} from "./service/usersApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [api.reducerPath]: api.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [AtolyeApi.reducerPath]: AtolyeApi.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, AuthApi.middleware, AtolyeApi.middleware, UsersApi.middleware),
});

export default store;
