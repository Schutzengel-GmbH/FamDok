import { IFamilies } from "@/pages/api/families";
import { IFooters } from "@/pages/api/footer";
import { IFooter } from "@/pages/api/footer/[uri]";
import { ILocations } from "@/pages/api/locations";
import { ILogs } from "@/pages/api/logs";
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

export function useFooterUris() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IFooters>(
    "/api/footer?getPageInfoOnly=true",
    fetcher
  );

  return {
    pages:
      data?.footerPages?.map((f) => ({ uri: f.uri, title: f.title })) || [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useFooterPageContent(uri: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IFooter>(
    uri ? `/api/footer/${uri}` : null,
    fetcher
  );

  return {
    page: data?.footerPage,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useLogs(level?: number, from?: Date, til?: Date) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ILogs>(
    `/api/logs?level=${
      level ?? 40
    }&from=${from?.toISOString()}?til=${til?.toISOString()}`,
    fetcher,
    { refreshInterval: 1000 }
  );

  return { logs: data?.logs, error, isLoading, isValidating, mutate };
}

export function useLocations() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ILocations>(
    "/api/locations",
    fetcher
  );

  return { locations: data?.locations, error, isLoading, isValidating, mutate };
}

