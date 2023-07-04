import useSWR from "swr";
import { IUserMe } from "../pages/api/user/me";
import { fetcher } from "./swrConfig";

export function useUserData() {
  const { data, error, isLoading, mutate } = useSWR<IUserMe>(
    "/api/user/me",
    fetcher
  );

  return {
    user: data?.user,
    isLoading: isLoading,
    error: error,
    mutate: mutate,
  };
}

export function generateTempPassword(): string {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "1234567890";

  const gen = (arr: string, n: number): string => {
    let res: string = "";
    for (let i = 0; i < n; i++) {
      res += arr.at(Math.floor(Math.random() * arr.length))!;
    }
    return res;
  };

  return `${gen(upperCase, 1)}${gen(lowerCase, 2)}${gen(numbers, 4)}`;
}
