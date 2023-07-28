import { GRID_LOCALE_TEXT } from "@/components/surveyStats/dataGridLocale";
import CustomGridToolbar from "@/components/surveyStats/gridToolbar";
import {
  getColumnsForSurvey,
  getRowsForResponses,
} from "@/components/surveyStats/responseTableLogic";
import { IResponses } from "@/pages/api/surveys/[survey]/responses";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { fetcher } from "@/utils/swrConfig";
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

  const { data, isLoading } = useSWR<IResponses>(
    `/api/surveys/${survey.id}/responses`,
    fetcher
  );

  if (data?.responses) rows = getRowsForResponses(data.responses, survey);

  console.log(columns, rows);

  return (
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
  );
}
