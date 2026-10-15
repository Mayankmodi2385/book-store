import { createApi } from "@reduxjs/toolkit/query/react";
import { secureBaseQuery } from "./booksApi";

export const authApi = createApi({
  reducerPath: "authApi",

  // Requests are encrypted and responses decrypted (see secureBaseQuery).
  baseQuery: secureBaseQuery,

  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData
      })
    }),

    login: builder.mutation({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        body: userData
      })
    })
  })
});

export const { useSignupMutation, useLoginMutation } = authApi;