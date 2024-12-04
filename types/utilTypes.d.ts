import { DataField } from "@prisma/client";

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

/**
 * Union of DataFieldAnswer and Answer
 * to be used in places where both work the same way
 */
export type AnswerTypeUnion = DataFieldAnswer | Answer;

/**
 * Union of DataFieldAnswer and Answer
 * to be used in places where both work the same way
 */
export type QuestionTypeUnion = DataField | Question;

