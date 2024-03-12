import useToast from "@/components/notifications/notificationContext";
import { GRID_LOCALE_TEXT } from "@/components/surveyStats/dataGridLocale";
import { getFullResponseJson } from "@/components/surveyStats/getJson";
import CustomGridToolbar from "@/components/surveyStats/gridToolbar";
import { optionalFields } from "@/components/surveyStats/responseTableFields";
import {
  getColumnsForSurvey,
  getRowsForResponses,
} from "@/components/surveyStats/responseTableLogic";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { IResponse } from "@/pages/api/surveys/[survey]/responses/[response]";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { FetchError, apiDelete } from "@/utils/fetchApiUtils";
import { fetcher } from "@/utils/swrConfig";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridColumnGroupingModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { GridColumnGroupingApi } from "@mui/x-data-grid/models/api/gridColumnGroupingApi";
import { QuestionType } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

type ResponsesTableProps = {
  survey: FullSurvey;
};

export default function ResponsesTable({ survey }: ResponsesTableProps) {
  const [selectedIds, updateSelectedIds] = useState<GridRowSelectionModel>([]);

  let columns = getColumnsForSurvey(survey);
  let columnGroups: GridColumnGroupingModel = [
    ...survey.questions
      .filter((q) => q.type === QuestionType.Select)
      .map((q) => ({
        groupId: q.questionText,
        children: [...q.selectOptions.map((o) => ({ field: o.id }))],
      })),
  ];
  if (survey.hasFamily) {
    columns.push(...optionalFields);
    columnGroups.push({
      groupId: "Familie",
      children: [...optionalFields.map((f) => ({ field: f.field }))],
    });
  }

  let rows: Record<string, any>[] = [];

  const { data, isLoading, mutate } = useSWR<IResponses>(
    survey.id ? `/api/surveys/${survey.id}/responses` : undefined,
    fetcher
  );

  const { addToast } = useToast();

  async function deleteResponses() {
    for (let id of selectedIds) {
      const res = await apiDelete<IResponse>(
        `/api/surveys/${survey.id}/responses/${id}`
      );
      if (res instanceof FetchError)
        addToast({ message: res.error || "Fehler", severity: "error" });
      else if (res.error) addToast({ message: res.error, severity: "error" });
      else
        addToast({
          message: `${res.response.id} gelöscht`,
          severity: "success",
        });
      mutate();
    }
  }

  if (data?.responses) rows = getRowsForResponses(data.responses, survey);

  return (
    <>
      <Button onClick={deleteResponses}>DELETE</Button>
      <DataGrid
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroups}
        columns={columns}
        rows={rows || []}
        checkboxSelection
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={(selectionModel) =>
          updateSelectedIds(selectionModel)
        }
        slots={{
          toolbar: CustomGridToolbar,
        }}
        slotProps={{
          toolbar: {
            selectedIds,
            fileName:
              survey.name + "_" + new Date().toISOString() ||
              "data_" + new Date().toISOString(),
            data: data?.responses,
            jsonExportFnc: getFullResponseJson,
          },
        }}
        localeText={GRID_LOCALE_TEXT}
      />
    </>
  );
}
