import { Prisma } from "@prisma/client";

export class SurveyExport {
  survey: Prisma.SurveyGetPayload<{
    include: {
      questions: { include: { selectOptions: true } };
    };
  }>;
  surveyCreateInput: Prisma.SurveyCreateInput;

  constructor(
    survey: Prisma.SurveyGetPayload<{
      include: {
        questions: { include: { selectOptions: true } };
      };
    }>
  ) {
    this.survey = survey;
    this.surveyCreateInput = this.getSurveyCreateInput();
  }

  getSurveyCreateInput(): Prisma.SurveyCreateInput {
    return {
      name: this.survey.name,
      description: this.survey.description,
      hasFamily: this.survey.hasFamily,
      questions: { createMany: { data: this.getQestionsCreateInputs() } },
    };
  }

  getQestionsCreateInputs(): Prisma.QuestionCreateInput[] {
    let questions: Prisma.QuestionCreateInput[] = [];

    for (const question of this.survey.questions) {
      questions.push({
        type: question.type,
        questionText: question.questionText,
        questionDescription: question.questionDescription,
        questionTitle: question.questionTitle,
        intRange: question.intRange,
        intRangeHigh: question.intRangeHigh,
        intRangeLow: question.intRangeLow,
        selectMultiple: question.selectMultiple,
        selectOptions: {
          createMany: {
            data: question.selectOptions.map((option) => ({
              value: option.value,
            })),
          },
        },
        numberInSurvey: question.numberInSurvey,
        survey: { connect: { id: this.survey.id } },
      });
    }

    return questions;
  }

  toString() {
    return JSON.stringify(this.surveyCreateInput);
  }
}

