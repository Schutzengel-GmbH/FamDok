import { FullQuestion, PartialAnswer } from "@/types/prismaHelperTypes";
import { SelectOption } from "@prisma/client";

export function areSameSelectAnswers(a: PartialAnswer, b: SelectOption[]) {
  if (a?.answerSelect == undefined || b == undefined) return false;

  if (a.answerSelect.length !== b.length) return false;

  return a.answerSelect.reduce((prev, oa) => {
    return b.find((ob) => ob.id === oa.id) ? prev && true : false;
  }, true);

  // let result: boolean;

  // for (const selectOption of a.answerSelect) {
  //   if (b.find((o) => o.id === selectOption.id)) result = true;
  //   else {
  //     result = false;
  //     break;
  //   }
  // }
  // return result;
}

export function getDefaultAnswer(q: FullQuestion) {
  if (!q) return undefined;
  return {
    questionId: q.id,
    answerText: q.defaultAnswerText || undefined,
    answerBool: q.defaultAnswerBool || undefined,
    answerInt: q.defaultAnswerInt || undefined,
    answerNum: q.defaultAnswerNum || undefined,
    answerSelect: q.defaultAnswerSelectOptions || [],
    answerDate: q.defaultAnswerDate || undefined,
  };
}

