import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const booksApi = createApi({
  reducerPath: "booksApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api"
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