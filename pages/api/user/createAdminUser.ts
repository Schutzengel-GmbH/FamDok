import { SessionRequest } from "supertokens-node/framework/express";
import supertokens from "supertokens-node/lib/build/supertokens";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import UserRoles from "supertokens-node/recipe/userroles";
import { backendConfig } from "@/config/backendConfig";
import { prisma } from "@/db/prisma";
import EmailPassword from "supertokens-node/recipe/emailpassword";

supertokens.init(backendConfig());

export interface ICreateAdminUser {
  error?: "INTERNAL_SERVER_ERROR";
}

export default async function createAdminUser(req: SessionRequest, res: any) {
  await superTokensNextWrapper(
    async (next) => {
      await verifySession({
        overrideGlobalClaimValidators: async function (globalClaimValidators) {
          return [
            ...globalClaimValidators,
            UserRoles.UserRoleClaim.validators.includes("admin"),
          ];
        },
      })(req, res, next);
    },
    req,
    res
  );

  const session = req.session;
  const authId = session.getUserId();
  let userInfo = await EmailPassword.getUserById(authId);

  const user = await prisma.user
    .create({
      data: { authId: authId, email: userInfo.email, role: "ADMIN" },
    })
    .catch((err) => console.log(err));

  if (!user) return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

  return res.status(200).json({ user });
}
