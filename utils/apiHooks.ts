import { IFamilies } from "@/pages/api/families";
import { useUserData } from "@/utils/authUtils";
import { fetcher } from "@/utils/swrConfig";
import useSWR from "swr";

export function useFamilies() {
  const { user, error: userError } = useUserData();

  const { data, error, isLoading, isValidating, mutate } = useSWR<IFamilies>(
    user ? `/api/families` : null,
    fetcher
  );

  if (userError)
    return {
      data: undefined,
      error: userError,
      isLoading: false,
      isValidating: false,
      mutate,
    };
  else
    return {
      families: data?.families,
      error,
      isLoading,
      isValidating,
      mutate,
    };
}

