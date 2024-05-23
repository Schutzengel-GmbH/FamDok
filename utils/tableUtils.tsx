import { FullResponse, FullSurvey, IAnswerSelectOtherValue } from "@/types/prismaHelperTypes";
import { QuestionType } from "@prisma/client";
import { ColumnDefinition } from "react-tabulator";

type ResponseTableData = { [questionId: string]: string | number | boolean | Date | { [selectOptionId: string]: string | boolean } | undefined };

export function responsesToAllAnswersTable(responses: FullResponse[]): ResponseTableData[] {
  let result: ResponseTableData[] = [];

  for (const response of responses) {
    let data: ResponseTableData = {};
    for (const answer of response.answers) {
      if (answer.question.type === QuestionType.Select || answer.question.type === QuestionType.Scale)
        data[answer.question.id] = answer.answerSelect.reduce<{ [id: string]: string | boolean }>((acc, s) => {
          if (s.isOpen) return { ...acc, [s.id]: (answer.answerSelectOtherValues as IAnswerSelectOtherValue[]).find(ov => ov.selectOptionId === s.id).value }
          else return { ...acc, [s.id]: true }
        }, {});
      else {
        switch (answer.question.type) {
          case QuestionType.Date: data[answer.question.id] = answer.answerDate ? new Date(answer.answerDate).toLocaleDateString() : undefined; break;
          case QuestionType.Int: data[answer.question.id] = answer.answerInt ?? undefined; break;
          case QuestionType.Num: data[answer.question.id] = answer.answerNum ?? undefined; break;
          case QuestionType.Bool: data[answer.question.id] = answer.answerBool ?? undefined; break;
          case QuestionType.Text: data[answer.question.id] = answer.answerText; break;
        }
      }
    }
    result.push(data);
  }

  return result;
}

export function allAnswersColumnDefinition(survey: FullSurvey): ColumnDefinition[] {
  return survey.questions.map<ColumnDefinition>(question => {
    if (question.type === QuestionType.Select || question.type === QuestionType.Scale)
      return { title: question.questionText, columns: question.selectOptions.map<ColumnDefinition>(selectOption => ({ title: selectOption.value, field: `${question.id}.${selectOption.id}` })) }
    else
      return { title: question.questionText, field: question.id }
  })
}