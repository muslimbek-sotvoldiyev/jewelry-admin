import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authlice";
// import api from "./service/api";
import AuthApi from "./service/authApi";
import {AtolyeApi} from "./service/atolyeApi";
import {UsersApi} from "./service/usersApi";
import { MaterialsApi } from "./service/materialsApi";
import { InventoryApi } from "./service/inventoryApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    // [api.reducerPath]: api.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [AtolyeApi.reducerPath]: AtolyeApi.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [MaterialsApi.reducerPath]: MaterialsApi.reducer,
    [InventoryApi.reducerPath]: InventoryApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AuthApi.middleware, AtolyeApi.middleware, UsersApi.middleware, MaterialsApi.middleware, InventoryApi.middleware),
});

export default store;
