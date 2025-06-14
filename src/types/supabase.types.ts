export interface SupabaseResponse<T> {
  data: T | null; // The data returned from the query, or null if there was an error
  error: {
    message: string; // A message describing the error
    code?: string; // An optional error code
    details?: string; // Additional details about the error
  } | null; // The error object, or null if there was no error
  count?: number | null;
}
