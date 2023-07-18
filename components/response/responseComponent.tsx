import { Box } from "@mui/material";
import {
  ChangedOrNewAnswer,
  FullResponse,
  FullSurvey,
} from "@/types/prismaHelperTypes";
import { useState } from "react";
import ResponseRelationComponent, {
  ResponseRelation,
} from "@/components/response/responseRelationComponent";
import ResponseAnswerQuestionComponent from "@/components/response/responseAnswerQuestionComponent";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import { useRouter } from "next/router";

type ResponseComponentProps = {
  response?: FullResponse;
  survey: FullSurvey;
};

export default function ResponseComponent({
  response,
  survey,
}: ResponseComponentProps) {
  const router = useRouter();

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [currentRelation, setCurrentRelation] = useState<ResponseRelation>({
    family: response?.family,
    caregiver: response?.caregiver,
    child: response?.child,
  });
  const [changedOrNewAnswers, setChangedOrNewAnswers] = useState<
    ChangedOrNewAnswer[]
  >([]);

  async function handleSave() {}

  function handleCancel() {
    router.push("/surveys");
  }

  function handleResponseRelationChange(changedRelation: ResponseRelation) {
    setCurrentRelation(changedRelation);
    setUnsavedChanges(true);
  }

  function handleAnswersChange(newAnswers: ChangedOrNewAnswer[]) {
    for (const newAnswer of newAnswers) {
      let index = changedOrNewAnswers.findIndex(
        (a) => a.question.id === newAnswer.question.id
      );
      if (index > -1)
        setChangedOrNewAnswers(
          changedOrNewAnswers.map((v, i) => (i === index ? newAnswer : v))
        );
      else setChangedOrNewAnswers([...changedOrNewAnswers, newAnswer]);
    }
    setUnsavedChanges(true);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <UnsavedChangesComponent
        unsavedChanges={unsavedChanges}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <ResponseRelationComponent
        relation={currentRelation}
        onChange={handleResponseRelationChange}
      />
      <ResponseAnswerQuestionComponent
        survey={survey}
        response={response}
        onChange={handleAnswersChange}
      />
    </Box>
  );
}
