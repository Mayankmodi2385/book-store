import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend URL. On Vercel you can override it with an Environment Variable
// named VITE_API_URL. By default it uses your live Render backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://book-store-api-7anz.onrender.com/api";

export const authApi = createApi({
  reducerPath: "authApi",

  // FIX: this used to be http://localhost:5000/api, which only works on your
  // own laptop. A phone cannot reach "localhost", so login/signup failed on iPhone.
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL
  }),

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