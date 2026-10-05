import { configureStore } from "@reduxjs/toolkit";

import { booksApi } from "../services/booksApi";
import { authApi } from "../services/authApi";

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(booksApi.middleware)
      .concat(authApi.middleware)
});