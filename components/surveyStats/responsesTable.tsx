import useToast from "@/components/notifications/notificationContext";
import { GRID_LOCALE_TEXT } from "@/components/surveyStats/dataGridLocale";
import CustomGridToolbar from "@/components/surveyStats/gridToolbar";
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
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import useSWR from "swr";

type ResponsesTableProps = {
  survey: FullSurvey;
};

export default function ResponsesTable({ survey }: ResponsesTableProps) {
  const [selectedIds, updateSelectedIds] = useState<GridRowSelectionModel>([]);

  let columns = getColumnsForSurvey(survey);
  let rows: Record<string, any>[] = [];

  const { data, isLoading, mutate } = useSWR<IResponses>(
    `/api/surveys/${survey.id}/responses`,
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
        columns={columns}
        rows={rows}
        checkboxSelection
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={(selectionModel) =>
          updateSelectedIds(selectionModel)
        }
        slots={{
          toolbar: () =>
            CustomGridToolbar(
              survey.name + "_" + new Date().toISOString() ||
                "data_" + new Date().toISOString()
            ),
        }}
        localeText={GRID_LOCALE_TEXT}
      />
    </>
  );
}
