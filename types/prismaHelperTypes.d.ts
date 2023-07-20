import { Prisma, SelectOption, Answer, SelectOption } from "@prisma/client";

export type FullResponse = Prisma.ResponseGetPayload<{
  include: {
    answers: {
      include: {
        answerSelect: true;
      };
    };
    family: { include: { caregivers: true; children: true } };
    caregiver: true;
    child: true;
    user: true;
  };
}>;

export type FullQuestion = Prisma.QuestionGetPayload<{
  include: { selectOptions: true; defaultAnswerSelectOptions: true };
}>;

export type FullFamily = Prisma.FamilyGetPayload<{
  include: { caregivers: true; children: true };
}>;

export type FullSurvey = Prisma.SurveyGetPayload<{
  include: {
    questions: {
      include: { selectOptions: true; defaultAnswerSelectOptions: true };
    };
  };
}>;

export type FullSurveyWithResponses = Prisma.SurveyGetPayload<{
  include: {
    questions: {
      include: { selectOptions: true; defaultAnswerSelectOptions: true };
    };
    responses: {
      include: {
        survey: {
          include: {
            questions: {
              include: {
                selectOptions: true;
                defaultAnswerSelectOptions: true;
              };
            };
          };
        };
        answers: {
          include: {
            answerSelect: true;
            question: {
              include: {
                selectOptions: true;
                defaultAnswerSelectOptions: true;
              };
            };
          };
        };
        family: { include: { caregivers: true; children: true } };
        caregiver: true;
        child: true;
        user: true;
      };
    };
  };
}>;

export type FullAnswer = Prisma.AnswerGetPayload<{
  include: {
    answerSelect: true;
    question: {
      include: {
        defaultAnswerSelectOptions: true;
        selectOptions: true;
      };
    };
  };
}>;

export type PartialAnswer = Partial<Answer> & {
  answerSelect: Partial<SelectOption>[];
};
