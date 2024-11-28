import { Box } from "@mui/material";
import {
  FullResponse,
  FullSurvey,
  PartialAnswer,
} from "@/types/prismaHelperTypes";
import { useEffect, useState } from "react";
import ResponseAnswerQuestionsComponent from "@/components/response/responseAnswerQuestionComponent";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import { useRouter } from "next/router";
import { FetchError, apiGet, apiPostJson } from "@/utils/fetchApiUtils";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { ISubmitAnswer } from "@/pages/api/surveys/[survey]/responses/[response]/submitAnswers";
import { InputErrors } from "@/components/response/answerQuestion";
import InputErrorsComponent from "@/components/response/inputErrorsComponent";
import { answerHasNoValues } from "@/utils/utils";
import { IResponse } from "@/pages/api/surveys/[survey]/responses/[response]";
import useToast from "@/components/notifications/notificationContext";
import { MasterData } from "@prisma/client";
import SelectMasterData from "@/components/response/selectMasterData";

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
  const { addToast } = useToast();
  const [response, setResponse] = useState<FullResponse>(initialResponse);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [answersState, setAnswersState] = useState<PartialAnswer[]>(
    response?.answers || getDefaultAnswerstate(survey)
  );
  const [inputErrors, setInputErrors] = useState<
    { questionId: string; error: InputErrors }[]
  >([]);
  const [masterData, setMasterData] = useState<Partial<MasterData>>(
    initialResponse?.masterData
  );

  async function handleSave() {
    if (!response) {
      const res = await apiPostJson<IResponses>(
        `/api/surveys/${survey.id}/responses`,
        { masterData }
      );
      if (res instanceof FetchError)
        addToast({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addToast({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          submitAnswers(res.response.id);
        }
      }
    } else {
      const res = await apiPostJson<IResponse>(
        `/api/surveys/${survey.id}/responses/${response.id}/`,
        { masterData }
      );
      if (res instanceof FetchError)
        addToast({
          message: `Fehler bei der Verbindung zum Server: ${res.error}`,
          severity: "error",
        });
      else {
        if (res.error)
          addToast({
            message: `Fehler: ${res.error}`,
            severity: "error",
          });
        else {
          submitAnswers(response.id);
        }
      }
    }
  }

  async function submitAnswers(responseId: string) {
    const res = await apiPostJson<ISubmitAnswer>(
      `/api/surveys/${survey.id}/responses/${responseId}/submitAnswers`,
      { answersState }
    );
    if (res instanceof FetchError)
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    else {
      if (res.error)
        addToast({
          message: `Fehler: ${res.error}`,
          severity: "error",
        });
      else {
        addToast({ message: `Antworten gespeichert`, severity: "success" });
      }
    }
    onChange();
    setAnswersState(getDefaultAnswerstate(survey));
    setUnsavedChanges(false);
    router.push("/surveys");
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

    if (error !== undefined && indexOfError >= 0)
      setInputErrors(
        inputErrors.map((e) =>
          e.questionId === newAnswer.questionId
            ? { questionId: newAnswer.questionId, error }
            : e
        )
      );
    else if (error !== undefined && indexOfError < 0)
      setInputErrors([
        ...inputErrors,
        { questionId: newAnswer.questionId, error },
      ]);
    else
      setInputErrors(
        inputErrors.filter((e) => e.questionId !== newAnswer.questionId)
      );
  }

  function handleMasterDataChanged(masterData: MasterData) {
    setMasterData(masterData);
    setUnsavedChanges(true);
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
          top: "4.5rem",
          zIndex: "100",
          minWidth: "100%",

          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <UnsavedChangesComponent
          errors={
            inputErrors.length > 0 ||
            requiredQuestionsWithoutAnswers() ||
            (survey.hasMasterData && !masterData)
          }
          unsavedChanges={unsavedChanges}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>
      <InputErrorsComponent
        survey={survey}
        errors={inputErrors}
        noRequiredMasterData={survey.hasMasterData && !masterData}
      />
      {survey.hasMasterData && (
        <SelectMasterData
          masterDataType={survey.masterDataType}
          masterData={masterData}
          onChange={handleMasterDataChanged}
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
    answerSelect: q.defaultAnswerSelectOptions || [],
    answerDate: q.defaultAnswerDate || undefined,
  }));
}
