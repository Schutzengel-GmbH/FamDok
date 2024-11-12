import { IComingFromOptions } from "@/pages/api/comingFromOptions";
import { IConfig } from "@/pages/api/config";
import { IFamilies } from "@/pages/api/families";
import { IFooters } from "@/pages/api/footer";
import { IFooter } from "@/pages/api/footer/[uri]";
import { ILocations } from "@/pages/api/locations";
import { ILogs } from "@/pages/api/logs";
import { IMasterDataType } from "@/pages/api/masterDataType";
import { IMasterDataTypeByID } from "@/pages/api/masterDataType/[masterDataType]";
import { IMasterData } from "@/pages/api/masterDataType/[masterDataType]/[masterData]";
import { IMasterDataByNumber } from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]";
import { IOrganizations } from "@/pages/api/organizations";
import { ISubOrganizations } from "@/pages/api/subOrganizations";
import { ISurveys } from "@/pages/api/surveys";
import { ISurvey } from "@/pages/api/surveys/[survey]";
import { IResponses } from "@/pages/api/surveys/[survey]/responses/my";
import { IUsers } from "@/pages/api/user";
import { useUserData } from "@/utils/authUtils";
import { fetcher } from "@/utils/swrConfig";
import { MasterDataType, Prisma } from "@prisma/client";
import useSWR from "swr";

export function useFamilies(whereInput?: Prisma.FamilyWhereInput) {
  const { user, error: userError } = useUserData();

  const { data, error, isLoading, isValidating, mutate } = useSWR<IFamilies>(
    user
      ? `/api/families?whereInput=${JSON.stringify(whereInput) || ""}`
      : null,
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
    user && number
      ? `/api/families?whereInput=${JSON.stringify({
          number: number,
        } as Prisma.FamilyWhereInput)}`
      : null,
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

export function useMyFamilies(whereInput?: Prisma.FamilyWhereInput) {
  const { user, error: userError } = useUserData();

  const { data, error, isLoading, isValidating, mutate } = useSWR<IFamilies>(
    user
      ? `/api/families?whereInput=${JSON.stringify(whereInput) || ""}`
      : null,
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
      organizationId
        ? `/api/subOrganizations?organizationId=${organizationId}`
        : null,
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

export function useMyResponses(
  surveyId: string,
  whereInput?: Prisma.ResponseWhereInput
) {
  const input = JSON.stringify(whereInput);

  const { data, error, isLoading, isValidating, mutate } = useSWR<IResponses>(
    surveyId
      ? `/api/surveys/${surveyId}/responses/my?whereInput=${input || "{}"}`
      : null,
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

export function useResponses(
  surveyId: string,
  whereInput?: Prisma.ResponseWhereInput
) {
  const input = JSON.stringify(whereInput);

  const { data, error, isLoading, isValidating, mutate } = useSWR<IResponses>(
    surveyId
      ? `/api/surveys/${surveyId}/responses?whereInput=${input || "{}"}`
      : null,
    fetcher
  );

  return { responses: data?.responses, error, isLoading, isValidating, mutate };
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

export function useSurveys() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ISurveys>(
    `/api/surveys`,
    fetcher
  );

  return {
    surveys: data?.surveys,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useConfigRaw() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IConfig>(
    "/api/config",
    fetcher
  );

  return {
    config: data?.config,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useMasterDataTypes() {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<IMasterDataType>("/api/masterDataType", fetcher);

  return {
    masterDataTypes: data?.masterDataTypes,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useMasterDataTypeById(id: string) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<IMasterDataTypeByID>(
      id ? `/api/masterDataType/${id}` : null,
      fetcher
    );

  return {
    masterDataType: data?.masterDataType,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useMasterDataByNumber(
  masterDataTypeId: string,
  number: number
) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<IMasterDataByNumber>(
      masterDataTypeId && number
        ? `/api/masterDataType/${masterDataTypeId}/masterData/${number}`
        : null,
      fetcher
    );

  return {
    masterData: data?.masterData,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useMasterData(
  masterDataType: MasterDataType,
  whereInput?: Prisma.MasterDataWhereInput
) {
  const input = whereInput ? JSON.stringify(whereInput) : undefined;

  const { data, error, isLoading, isValidating, mutate } = useSWR<IMasterData>(
    masterDataType
      ? `/api/${masterDataType.id}/masterData${
          input ? `?whereInput=${input}` : ""
        }`
      : null,
    fetcher
  );

  return {
    masterData: data?.masterData,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
