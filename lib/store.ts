import { configureStore } from "@reduxjs/toolkit"
// import { jewelryApi } from "./api/jewelryApi"

export const store = configureStore({
  reducer: {
    // [jewelryApi.reducerPath]: jewelryApi.reducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(jewelryApi.middleware),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

// setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
