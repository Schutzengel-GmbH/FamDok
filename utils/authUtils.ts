import useSWR from "swr";
import { IUserMe } from "../pages/api/user/me";
import { fetcher } from "./swrConfig";

export function useUserData() {
  const { data, error, isLoading } = useSWR<IUserMe>("/api/user/me", fetcher);

  return {
    user: data.user,
    isLoading: isLoading,
    isError: error,
  };
}
