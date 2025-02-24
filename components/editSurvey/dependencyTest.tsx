"use client";

import { FullQuestion, FullSurvey } from "@/types/prismaHelperTypes";
import { Box, MenuItem, Select } from "@mui/material";
import { useState } from "react";

type DependencyTestProps = {
  questionId?: string;
  questions: FullQuestion[];
  dependencyTest: PrismaJson.DependencyTest;
  onChange: (value: PrismaJson.DependencyTest) => void;
};

export default function DependencyTest({
  questionId,
  questions,
  dependencyTest,
  onChange,
}: DependencyTestProps) {
  const selectedQuestion = questions.find(
    (q) => q.id === dependencyTest?.questionId
  );

  return (
    <Box sx={{ display: "flex", gap: ".5rem", flexDirection: "column" }}>
      <Select
        value={dependencyTest?.questionId}
        onChange={(e) =>
          onChange({ ...dependencyTest, questionId: e.target.value })
        }
      >
        {questions
          .filter((q) => q.id !== questionId)
          .map((q) => (
            <MenuItem value={q.id}>{q.questionText}</MenuItem>
          ))}
      </Select>
      {selectedQuestion?.type === "Bool" && <>Bool</>}
      {selectedQuestion?.type === "Collection" && <>Collection</>}
      {selectedQuestion?.type === "Date" && <>Date</>}
      {selectedQuestion?.type === "Int" && <>Int</>}
      {selectedQuestion?.type === "Num" && <>Num</>}
      {selectedQuestion?.type === "Scale" && <>Scale</>}
      {selectedQuestion?.type === "Select" && <>Select</>}
      {selectedQuestion?.type === "Text" && <>Text</>}
    </Box>
  );
}

