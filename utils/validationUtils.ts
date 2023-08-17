export function isValidEmail(email: string) {
  let regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return regexp.test(email);
}

type RejectionReason =
  | "SHORT"
  | "NO_UPPERCASE"
  | "NO_LOWERCASE"
  | "NO_NUMERIC"
  | "NO_SPECIAL";

export type PasswordValidation = {
  valid: boolean;
  rejectionReasons: RejectionReason[];
};

export function passwordValidator(password: string): PasswordValidation {
  let validation: PasswordValidation = { valid: false, rejectionReasons: [] };

  if (password.length < 8) validation.rejectionReasons.push("SHORT");
  if (password.search(/[a-z]/) < 0)
    validation.rejectionReasons.push("NO_LOWERCASE");
  if (password.search(/[A-Z]/) < 0)
    validation.rejectionReasons.push("NO_UPPERCASE");
  if (password.search(/[0-9]/) < 0)
    validation.rejectionReasons.push("NO_NUMERIC");

  if (validation.rejectionReasons.length === 0) validation.valid = true;

  return validation;
}
