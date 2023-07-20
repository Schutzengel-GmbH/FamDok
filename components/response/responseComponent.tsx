import { Box } from "@mui/material";
import {
  FullResponse,
  FullSurvey,
  PartialAnswer,
} from "@/types/prismaHelperTypes";
import { useState } from "react";
import ResponseRelationComponent, {
  ResponseRelation,
} from "@/components/response/responseRelationComponent";
import ResponseAnswerQuestionsComponent from "@/components/response/responseAnswerQuestionComponent";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import { useRouter } from "next/router";
import { ISurveys } from "@/pages/api/surveys";
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import useNotification from "../utilityComponents/notificationContext";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { Prisma } from "@prisma/client";
import { ISubmitAnswer } from "@/pages/api/surveys/[survey]/responses/[response]/submitAnswers";

type ResponseComponentProps = {
  initialResponse?: FullResponse;
  survey: FullSurvey;
};

export default function ResponseComponent({
  initialResponse,
  survey,
}: ResponseComponentProps) {
  const router = useRouter();
  const { addAlert } = useNotification();
  const [response, setResponse] = useState<FullResponse>(initialResponse);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [currentRelation, setCurrentRelation] = useState<ResponseRelation>({
    family: response?.family,
    caregiver: response?.caregiver,
    child: response?.child,
  });
  const [answersState, setAnswersState] = useState<PartialAnswer[]>(
    response?.answers || getDefaultAnswerstate(survey)
  );

  async function handleSave() {
    if (!response) {
      const res = await apiPostJson<IResponses>(
        `/api/surveys/${survey.id}/responses`,
        {}
      );
      if (res instanceof FetchError)
        addAlert({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addAlert({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          setResponse(res.response);
          submitAnswers(res.response.id);
        }
      }
    } else {
      submitAnswers(response.id);
    }
  }

  async function submitAnswers(responseId: string) {
    const res = await apiPostJson<ISubmitAnswer>(
      `/api/surveys/${survey.id}/responses/${responseId}/submitAnswers`,
      { answersState }
    );
    if (res instanceof FetchError)
      addAlert({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addAlert({
          message: `Fehler: ${res.error}`,
          severity: "error",
        });
      else {
        addAlert({ message: `Antworten gespeichert`, severity: "success" });
      }
    }

    setUnsavedChanges(false);
  }

  function handleCancel() {
    router.push("/surveys");
  }

  function handleAnswerChanged(newAnswer: PartialAnswer) {
    setAnswersState(
      answersState.map((a) =>
        a.questionId === newAnswer.questionId ? newAnswer : a
      )
    );
    setUnsavedChanges(true);
  }

  function handleResponseRelationChange(changedRelation: ResponseRelation) {
    setCurrentRelation(changedRelation);
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
      <ResponseAnswerQuestionsComponent
        survey={survey}
        answersState={answersState}
        onChange={handleAnswerChanged}
      />
    </Box>
  );
}

function getDefaultAnswerstate(survey: FullSurvey): PartialAnswer[] {
  return survey.questions.map<PartialAnswer>((q) => ({
    questionId: q.id,
    answerText: q.defaultAnswerText || undefined,
    answerBool: q.defaultAnswerBool || undefined,
    answerInt: q.defaultAnswerInt || undefined,
    answerNum: q.defaultAnswerNum || undefined,
    answerSelect: q.defaultAnswerSelectOptions || undefined,
    answerDate: q.defaultAnswerDate || undefined,
  }));
}
