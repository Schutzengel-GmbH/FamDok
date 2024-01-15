import { Box } from "@mui/material";
import {
  FullFamily,
  FullResponse,
  FullSurvey,
  PartialAnswer,
} from "@/types/prismaHelperTypes";
import { useEffect, useState } from "react";
import ResponseRelationComponent, {
  ResponseRelation,
} from "@/components/response/responseRelationComponent";
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
import { useFamily } from "@/utils/apiHooks";
import { IFamilies } from "@/pages/api/families";

type ResponseComponentProps = {
  initialResponse?: FullResponse;
  survey: FullSurvey;
  onChange: () => void;
  familyNumber?: number;
};

export default function ResponseComponent({
  initialResponse,
  survey,
  onChange,
  familyNumber,
}: ResponseComponentProps) {
  const router = useRouter();
  const { addToast } = useToast();
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

  useEffect(() => {
    if (familyNumber) createResponseForFamily(familyNumber);
  }, []);

  async function handleSave() {
    if (!response) {
      const res = await apiPostJson<IResponses>(
        `/api/surveys/${survey.id}/responses`,
        { ...currentRelation }
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
        { ...currentRelation }
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

  async function createResponseForFamily(familyNumber: number) {
    const res = await apiGet<IFamilies>(`/api/families?number=${familyNumber}`);
    if (res instanceof FetchError) {
      addToast({
        message: `Fehler bei der Verbindung zum Server: ${res.error}`,
        severity: "error",
      });
    } else if (res.error) {
      addToast({
        message: `Fehler: ${res.error}`,
        severity: "error",
      });
    } else {
      setCurrentRelation({
        family: res.families[0],
        child: undefined,
        caregiver: undefined,
      });
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
    if (!isSameRelation(changedRelation, currentRelation)) {
      setCurrentRelation(changedRelation);
      setUnsavedChanges(true);
    }
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
          errors={
            inputErrors.length > 0 ||
            requiredQuestionsWithoutAnswers() ||
            (survey.hasFamily && !currentRelation.family)
          }
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
    answerSelect: q.defaultAnswerSelectOptions || [],
    answerDate: q.defaultAnswerDate || undefined,
  }));
}

function isSameRelation(
  relationA: ResponseRelation,
  relationB: ResponseRelation
) {
  return (
    relationA?.family?.id == relationB?.family?.id &&
    relationA?.caregiver?.id == relationB?.caregiver?.id &&
    relationA?.child?.id == relationB?.child?.id
  );
}
