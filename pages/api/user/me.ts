import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import { prisma } from "../../../db/prisma";
import { Prisma, User } from "@prisma/client";
import { isValidEmail } from "../../../utils/validationUtils";
import EmailPassword from "supertokens-node/recipe/emailpassword";

supertokens.init(backendConfig());

export interface IUserMe {
  user?: User;
  error?:
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR"
    | "INVALID_EMAIL"
    | "METHOD_NOT_ALLOWED"
    | "EMAIL_ALREADY_EXISTS_ERROR";
}

export default async function me(req, res) {
  await superTokensNextWrapper(
    async (next) => {
      return await verifySession()(req, res, next);
    },
    req,
    res
  );

  let user: User;
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: { authId: req.session.getUserId() },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    )
      return res.status(404).json({ error: "NOT_FOUND" });

    console.error(err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }

  switch (req.method) {
    case "GET":
      return res.json({ user });

    case "POST":
      // ignore all fields except name and email
      let userUpdate: Prisma.UserUpdateInput = {};
      userUpdate.name = req.body.name;
      userUpdate.email = req.body.email;

      if (req.body.email && !isValidEmail(req.body.email))
        return res.status(400).json({ error: "INVALID_EMAIL" });

      // update auth email if changed
      if (userUpdate.email && userUpdate.email !== user.email) {
        let resp = await EmailPassword.updateEmailOrPassword({
          userId: req.session.getUserId(),
          email: userUpdate.email as string,
        });

        switch (resp.status) {
          case "OK":
            break;
          case "EMAIL_ALREADY_EXISTS_ERROR":
            return res
              .status(400)
              .json({ error: "EMAIL_ALREADY_EXISTS_ERROR" });
          default:
            console.error(resp);
            return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
        }
      }

      const update = await prisma.user.update({
        data: userUpdate,
        where: { id: user.id },
      });

      if (!update)
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });

      return res.status(200).json({ user: update });

    default:
      return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }
}
