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
import { FetchError, apiPostJson } from "@/utils/fetchApiUtils";
import useNotification from "../utilityComponents/notificationContext";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { ISubmitAnswer } from "@/pages/api/surveys/[survey]/responses/[response]/submitAnswers";
import { InputErrors } from "@/components/response/answerQuestion";
import InputErrorsComponent from "@/components/response/inputErrorsComponent";
import { answerHasNoValues } from "@/utils/utils";
import { IResponse } from "@/pages/api/surveys/[survey]/responses/[response]";

type ResponseComponentProps = {
  initialResponse?: FullResponse;
  survey: FullSurvey;
  onChange: () => void;
};

export default function ResponseComponent({
  initialResponse,
  survey,
  onChange,
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
  const [inputErrors, setInputErrors] = useState<
    { questionId: string; error: InputErrors }[]
  >([]);

  async function handleSave() {
    if (!response) {
      const res = await apiPostJson<IResponses>(
        `/api/surveys/${survey.id}/responses`,
        { ...currentRelation }
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
      const res = await apiPostJson<IResponse>(
        `/api/surveys/${survey.id}/responses/${response.id}/`,
        { ...currentRelation }
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
          setResponse(response);
          submitAnswers(response.id);
        }
      }
    }
    onChange();
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

  function handleAnswerChanged(newAnswer: PartialAnswer, error?: InputErrors) {
    setAnswersState(
      answersState.map((a) =>
        a.questionId === newAnswer.questionId ? newAnswer : a
      )
    );
    setUnsavedChanges(true);

    const indexOfError = inputErrors.findIndex(
      (e) => e.questionId === newAnswer.questionId
    );

    if (error && indexOfError >= 0)
      setInputErrors(
        inputErrors.map((e) =>
          e.questionId === newAnswer.questionId
            ? { questionId: newAnswer.questionId, error }
            : e
        )
      );
    else if (error && indexOfError < 0)
      setInputErrors([
        ...inputErrors,
        { questionId: newAnswer.questionId, error },
      ]);
    else
      setInputErrors(
        inputErrors.filter((e) => e.questionId !== newAnswer.questionId)
      );
  }

  function requiredQuestionsWithoutAnswers() {
    return (
      survey.questions.filter(
        (q) =>
          q.required &&
          answerHasNoValues(answersState.find((a) => a.questionId === q.id))
      ).length > 0
    );
  }

  function handleResponseRelationChange(changedRelation: ResponseRelation) {
    setCurrentRelation(changedRelation);
    setUnsavedChanges(true);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          alignSelf: "flex-start",
          top: ".5rem",
          zIndex: "100",
          minWidth: "100%",

          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <UnsavedChangesComponent
          errors={inputErrors.length > 0 || requiredQuestionsWithoutAnswers()}
          unsavedChanges={unsavedChanges}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>
      <InputErrorsComponent survey={survey} errors={inputErrors} />
      {survey.hasFamily && (
        <ResponseRelationComponent
          relation={currentRelation}
          onChange={handleResponseRelationChange}
        />
      )}
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
