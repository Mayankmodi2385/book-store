import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend URL. On Vercel you can override it with an Environment Variable
// named VITE_API_URL. By default it uses your live Render backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://book-store-api-7anz.onrender.com/api";

export const booksApi = createApi({
  reducerPath: "booksApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    }
  }),

  tagTypes: ["Books"],

  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => "/books",
      providesTags: ["Books"]
    }),

    createBook: builder.mutation({
      query: (book) => ({
        url: "/books",
        method: "POST",
        body: book
      }),
      invalidatesTags: ["Books"]
    }),

    updateBook: builder.mutation({
      query: ({ id, ...book }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: book
      }),
      invalidatesTags: ["Books"]
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Books"]
    })
  })
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation
} = booksApi;