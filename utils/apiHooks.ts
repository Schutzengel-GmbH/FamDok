import { IComingFromOptions } from "@/pages/api/comingFromOptions";
import { IConfig } from "@/pages/api/config";
import { IFamilies } from "@/pages/api/families";
import { IFooters } from "@/pages/api/footer";
import { IFooter } from "@/pages/api/footer/[uri]";
import { ILocations } from "@/pages/api/locations";
import { ILogs } from "@/pages/api/logs";
import { IOrganizations } from "@/pages/api/organizations";
import { ISubOrganizations } from "@/pages/api/subOrganizations";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import { IResponses } from "@/pages/api/surveys/[survey]/responses/my";
import { IUsers } from "@/pages/api/user";
import { AppConfiguration } from "@/utils/appConfigUtils";
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

export function useFamily(number: number) {
  const { user, error: userError } = useUserData();

  const { data, error, isLoading, isValidating, mutate } = useSWR<IFamilies>(
    user && number ? `/api/families?number=${number}` : null,
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
      family: data?.families[0] || undefined,
      error,
      isLoading,
      isValidating,
      mutate,
    };
}

export function useMyFamilies() {
  const { user, error: userError } = useUserData();

  const { data, error, isLoading, isValidating, mutate } = useSWR<IFamilies>(
    user ? `/api/families?userId=${user.id}` : null,
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

export function useComingFromOptions() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<IComingFromOptions>("/api/comingFromOptions", fetcher);

  return {
    comingFromOptions: data?.comingFromOptions,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useUsers(queryString?: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IUsers>(
    `/api/user${queryString || ""}`,
    fetcher
  );

  return { users: data?.users, error, isLoading, isValidating, mutate };
}

export function useOrganizations() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<IOrganizations>("/api/organizations", fetcher);

  return {
    organizations: data?.organizations,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useSubOrganizations(organizationId) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ISubOrganizations>(
      `/api/subOrganizations?organizationId=${organizationId}`,
      fetcher
    );

  return {
    suborganizations: data?.subOrganizations,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useMyResponses(surveyId: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IResponses>(
    surveyId ? `/api/surveys/${surveyId}/responses/my` : null,
    fetcher
  );

  return {
    responses: data?.responses,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useSurvey(id: string) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ISurvey>(
    id ? `/api/surveys/${id}` : null,
    fetcher
  );

  return {
    survey: data?.survey,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useConfig() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IConfig>(
    "/api/config",
    fetcher
  );

  const config: Record<string, any> = data.config.reduce((prev, value) => {
    return { ...prev, [value.name]: value.value };
  }, {});

  return {
    config: config as AppConfiguration,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

