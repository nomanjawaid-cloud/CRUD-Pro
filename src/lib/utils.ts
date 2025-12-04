import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FetchOptions extends RequestInit {
  token?: string | null; // Allow token to be string, null, or undefined
}

export const authenticatedFetch = async (
  url: string,
  options?: FetchOptions,
) => {
  const newHeaders = new Headers(options?.headers);

  if (
    !newHeaders.has("Content-Type") &&
    options?.body instanceof FormData === false
  ) {
    newHeaders.set("Content-Type", "application/json");
  }

  if (options?.token) {
    newHeaders.set("Authorization", `Bearer ${options.token}`);
  }

  const res = await fetch(url, { ...options, headers: newHeaders });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong with the API call.");
  }
  return res.json();
};

export const authenticatedFormFetch = async (
  url: string,
  formData: FormData,
  method: string = "POST",
  token?: string | null, // Allow token to be string, null, or undefined
) => {
  const newHeaders = new Headers();
  if (token) {
    newHeaders.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(url, {
    method,
    headers: newHeaders,
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong with the API call.");
  }
  return res.json();
};
