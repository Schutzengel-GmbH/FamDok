import {
  ResponseFilter,
  FilterType,
  TextFilter,
  BoolFilter,
  NumberFilter,
  DateFilter,
  SelectFilter,
} from "@/components/myResponses/filter.t";
import { areSameSelectAnswers } from "@/components/myResponses/utils";
import { logger } from "@/config/logger";
import { FullResponse } from "@/types/prismaHelperTypes";
import { endOfDay, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";

export function filterByQuestionAnswer(filter: ResponseFilter<FilterType>) {
  if (!filter || !filter.filter) return () => true;

  return (response: FullResponse) => {
    const answer = response.answers.find(
      (q) => q.questionId === filter.question?.id
    );

    switch (filter.question?.type) {
      case "Text": {
        const f = filter.filter as TextFilter;
        if (f.onlyFullMatch && f.caseSensitive)
          return answer?.answerText === f.filterText;
        else if (f.onlyFullMatch && !f.caseSensitive)
          return (
            answer?.answerText?.toLowerCase() === f?.filterText?.toLowerCase()
          );
        else if (!f.onlyFullMatch && f.caseSensitive)
          return answer?.answerText.includes(
            (filter.filter as TextFilter).filterText
          );
        else if (!f.onlyFullMatch && !f.caseSensitive)
          return answer?.answerText
            ?.toLowerCase()
            .includes((filter.filter as TextFilter)?.filterText?.toLowerCase());
        else {
          logger.warn(filter, "error using a filter");
          return false;
        }
      }
      case "Bool": {
        return answer?.answerBool === (filter.filter as BoolFilter).filterBool;
      }
      case "Int": {
        const f = filter.filter as NumberFilter;
        if ((f.filterMax || f.filterMin || f.filterValue) && !answer.answerInt)
          return false;

        if (
          f.filterMax === null &&
          f.filterMin === null &&
          f.filterValue === null
        )
          return true;

        if (f.filterMin && f.filterMax) {
          return (
            answer.answerInt >= f.filterMin && answer.answerInt <= f.filterMax
          );
        } else if (f.filterMin) {
          return answer.answerInt >= f.filterMin;
        } else if (f.filterMax) {
          return answer.answerInt <= f.filterMax;
        } else if (f.filterValue) {
          return answer.answerInt === f.filterValue;
        } else {
          logger.warn(filter, "error using a filter");
          return false;
        }
      }
      case "Num": {
        const f = filter.filter as NumberFilter;
        if (f.filterMin && f.filterMax) {
          return (
            answer.answerNum >= f.filterMin && answer.answerNum <= f.filterMax
          );
        } else if (f.filterMin) {
          return answer.answerNum >= f.filterMin;
        } else if (f.filterMax) {
          return answer.answerNum <= f.filterMax;
        } else if (f.filterValue) {
          return answer.answerNum === f.filterValue;
        } else {
          logger.warn(filter, "error using a filter");
          return false;
        }
      }
      case "Date": {
        const f = filter.filter as DateFilter;
        const date = new Date(answer.answerDate);
        if (f.earlierThan && f.laterThan) {
          return (
            isAfter(date, startOfDay(f.laterThan)) &&
            isBefore(date, endOfDay(f.earlierThan))
          );
        } else if (f.earlierThan) {
          return isBefore(date, endOfDay(f.earlierThan));
        } else if (f.laterThan) {
          return isAfter(date, startOfDay(f.laterThan));
        } else if (f.match) {
          return isSameDay(date, f.match);
        } else {
          return true;
        }
      }
      case "Scale":
      case "Select": {
        const f = filter.filter as SelectFilter;
        if (f.anyOf) {
          return f.anyOf.some((v) =>
            answer.answerSelect.find((s) => s.id === v.id)
          );
        } else if (f.exactMatch) {
          return areSameSelectAnswers(answer, f.exactMatch);
        } else if (f.not) {
          return f.not.every(
            (v) => answer.answerSelect.find((s) => s.id === v.id) === undefined
          );
        } else {
          logger.warn(filter, "error using a filter");
          return false;
        }
      }
    }
  };
}

