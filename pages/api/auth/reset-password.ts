import { NextApiRequest, NextApiResponse } from "next";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response } from "express";
import { logger as _logger } from "@/config/logger";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { passwordValidator } from "@/utils/validationUtils";

export interface IResetPassword {
  error?:
    | "RESET_PASSWORD_INVALID_TOKEN_ERROR"
    | "INTERNAL_SERVER_ERROR"
    | "PASSWORD_INVALID";
}

export default async function resetPassword(
  req: NextApiRequest & SessionRequest,
  res: NextApiResponse & Response
) {
  const logger = _logger.child({
    endpoint: `/reset-password`,
    method: req.method,
    query: req.query,
    cookie: req.headers.cookie,
    body: req.body,
  });

  logger.info("accessed endpoint");

  const { token } = req.query as { token: string };
  const { password } = req.body as { password: string };

  if (!passwordValidator(password).valid)
    return res.status(400).json({ error: "PASSWORD_INVALID" });

  const result = await EmailPassword.resetPasswordUsingToken(
    "public",
    token,
    password
  );

  if (result.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR")
    res.status(400).json({ error: "RESET_PASSWORD_INVALID_TOKEN_ERROR" });
  else if (result.status !== "OK")
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  else res.status(200).json({});
}

