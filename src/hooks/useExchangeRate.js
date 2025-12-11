import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRate } from "../api";

export function useExchangeRate() {
  const {
    data: rate,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["exchangeRate"],
    queryFn: fetchExchangeRate,
    staleTime: 1000 * 60 * 60, // 1小時內不重新請求
    gcTime: 1000 * 60 * 60 * 24, // 快取保留24小時
  });

  return {
    rate,
    loading,
    error: error?.message || null,
  };
}
