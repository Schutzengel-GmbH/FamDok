import { Caregiver, Child, Family, Gender, Prisma } from "@prisma/client";
import { differenceInYears } from "date-fns";

export const getAge = (birthDate: Date) => {
  const today = new Date();
  const age = differenceInYears(today, new Date(birthDate));
  return Number.isNaN(age) ? undefined : age;
};

export function getGenderString(g: Gender) {
  switch (g) {
    case "Male":
      return "männlich";
    case "Female":
      return "weiblich";
    case "Other":
      return "anderes";
    case "Unknown":
      return "unbekannt";
  }
}

export function getAddFamilyInput(
  family: Partial<
    Family & { children: Partial<Child>[]; caregivers: Partial<Caregiver>[] }
  >,
  userId: string
): {
  familyCreate?: Prisma.FamilyCreateInput;
  error: boolean;
  errorMessage?: string;
} {
  if (!family.beginOfCare)
    return {
      error: true,
      errorMessage: "Betreuungsbeginn ist ein Pflichtfeld",
    };
  return {
    familyCreate: {
      ...family,
      beginOfCare: family.beginOfCare,
      caregivers: {
        createMany: {
          data:
            family.caregivers?.map((caregiver) => ({
              ...caregiver,
            })) || [],
        },
      },
      children: {
        createMany: {
          data:
            family.children?.map((child) => ({
              ...child,
            })) || [],
        },
      },
      createdBy: { connect: { id: userId } },
    },
    error: false,
  };
}
