import { HandleSupabaseErrorResponse } from "@/lib/error.handle.lib";
import React, { useEffect, useState, useCallback } from "react";

export default function useApi(
  name: string,
  getApi: any,
  dependencies: any[] = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HandleSupabaseErrorResponse<null> | null>(
    null
  );
  const [data, setData] = useState<any>(null);
  const [count, setCount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApi();
      if (response.data) {
        setData(response.data);
        setCount(response.count);
      }
      if (response.error) {
        setError(response);
      }
    } catch (err) {
      console.error(err, name);
      setError({
        error: true,
        message: "Failed to fetch data",
        data: null,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }, [getApi, name]);

  useEffect(() => {
    fetchData();
  }, [...dependencies]);

  return { loading, error, data, count };
}
