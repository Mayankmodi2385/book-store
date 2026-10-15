import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend URL. On Vercel you can override it with an Environment Variable
// named VITE_API_URL. By default it uses your live Render backend.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://book-store-api-7anz.onrender.com/api";

/* ==========================================================
   ENCRYPTED COMMUNICATION (RSA + AES-256-GCM)
   Every request body is encrypted before it leaves the browser,
   and every response is decrypted after it arrives.
   authApi.js uses secureBaseQuery from here too.
   ========================================================== */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64(buffer) {
  let text = "";
  new Uint8Array(buffer).forEach((byte) => {
    text += String.fromCharCode(byte);
  });
  return btoa(text);
}

function fromBase64(base64) {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

// Download the server's public key once and keep it for later requests.
let publicKeyPromise = null;

function getPublicKey() {
  if (!publicKeyPromise) {
    publicKeyPromise = fetch(`${API_URL}/public-key`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not get the public key");
        return response.json();
      })
      .then(({ publicKey }) =>
        crypto.subtle.importKey(
          "spki",
          fromBase64(publicKey),
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["encrypt"]
        )
      )
      .catch((error) => {
        publicKeyPromise = null;
        throw error;
      });
  }

  return publicKeyPromise;
}

async function encryptData(aesKey, data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    textEncoder.encode(JSON.stringify(data))
  );

  return { iv: toBase64(iv), d: toBase64(encrypted) };
}

async function decryptData(aesKey, { iv, d }) {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(iv) },
    aesKey,
    fromBase64(d)
  );

  return JSON.parse(textDecoder.decode(plain));
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }
});

// Used by booksApi and authApi instead of a plain fetchBaseQuery.
export const secureBaseQuery = async (
  args,
  api,
  extraOptions,
  isRetry = false
) => {
  try {
    const request = typeof args === "string" ? { url: args } : { ...args };

    // 1. A new random AES key for this request
    const publicKey = await getPublicKey();

    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // 2. Lock the AES key with the server's public key
    const rawKey = await crypto.subtle.exportKey("raw", aesKey);
    const lockedKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      rawKey
    );

    request.headers = { ...request.headers, "x-enc-key": toBase64(lockedKey) };

    // 3. Encrypt the body (if this request has one)
    if (request.body !== undefined) {
      request.body = await encryptData(aesKey, request.body);
    }

    const result = await rawBaseQuery(request, api, extraOptions);

    // The server restarted and has a new key: fetch it and try once more.
    if (result.error?.data?.code === "KEY_EXPIRED" && !isRetry) {
      publicKeyPromise = null;
      return secureBaseQuery(args, api, extraOptions, true);
    }

    // 4. Decrypt the response (or the error message)
    if (result.data?.d) {
      result.data = await decryptData(aesKey, result.data);
    }

    if (result.error?.data?.d) {
      result.error = {
        ...result.error,
        data: await decryptData(aesKey, result.error.data)
      };
    }

    return result;
  } catch (error) {
    return { error: { status: "FETCH_ERROR", error: String(error) } };
  }
};

export const booksApi = createApi({
  reducerPath: "booksApi",

  baseQuery: secureBaseQuery,

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