import useSWR from "swr";
import { IUserMe } from "../pages/api/user/me";
import { fetcher } from "./swrConfig";
import { getUser, listUsersByAccountInfo } from "supertokens-node";
import { Role, User } from "@prisma/client";

/**
 * Get user data, if no id is provided, uses /user/me
 * @param id id of the user
 * @returns user, isLoading, error, mutate
 */
export function useUserData(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<IUserMe>(
    `/api/user/${id ? id : "me"}`,
    fetcher,
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

export async function getUserByEmail(email: string) {
  const users = await listUsersByAccountInfo("public", { email });
  return users[0];
}

export async function getUserByAuthId(authId: string) {
  const user = await getUser(authId);
  console.log(authId, user);
  return user;
}

/**
 * Returns true if user has one of roles.
 * @param User user user to test
 * @param Role[] roles roles to test for
 * @param string organizationId (optional) if this parameter is given and the user is USER or ORGCONTROLLER, only return true if user is also in that organization
 */
export function hasOneOfRole(
  user: User,
  roles: Role[],
  organizationId?: string,
) {
  if (organizationId) {
    if (!roles.includes(user.role)) return false;
    if (user.role === Role.USER || user.role === Role.ORGCONTROLLER)
      return user.organizationId === organizationId;
    else return roles.includes(user.role);
  } else return roles.includes(user.role);
}
