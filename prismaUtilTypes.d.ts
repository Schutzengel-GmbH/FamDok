import { Prisma } from "@prisma/client";

export type FullFamily = Prisma.FamilyGetPayload<{
  include: { caregivers: true; children: true };
}>;

export type FullSurvey = Prisma.SurveyGetPayload<{
  include: { questions: { include: { selectOptions: true } } };
}>;
