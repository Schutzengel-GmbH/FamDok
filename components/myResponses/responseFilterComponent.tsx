import { FilterType, ResponseFilter } from "@/components/myResponses/filter.t";
import QuestionFilter from "@/components/myResponses/questionFilter";
import { FullSurvey } from "@/types/prismaHelperTypes";
import { useFamily } from "@/utils/apiHooks";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type ResponseFilterComponentProps = {
  filter: ResponseFilter<FilterType>;
  onChange: (filter: ResponseFilter<FilterType>) => void;
  survey?: FullSurvey;
  sx?: SxProps;
};

export default function ResponseFilterComponent({
  filter,
  onChange,
  sx,
  survey,
}: ResponseFilterComponentProps) {
  const [familyNumber, setFamilyNumber] = useState<number>(null);

  const { family } = useFamily(familyNumber);

  useEffect(() => {
    onChange({
      ...filter,
      familyId: family?.id,
    });
  }, [family]);

  function handleFamilyCheckedChange(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...filter, filterFamily: e.target.checked });
  }

  function handleQuestionChange(e: SelectChangeEvent<string>) {
    const q = survey.questions.find((q) => q.id === e.target.value);
    onChange({
      ...filter,
      filter: undefined,
      question: q,
    });
  }

  async function handleFamilyChange(e: ChangeEvent<HTMLInputElement>) {
    setFamilyNumber(parseInt(e.target.value));
  }

  return (
    <Box sx={sx}>
      <Paper
        sx={{
          m: "1rem",
          p: ".5rem",
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
        }}
      >
        <Typography>Filtern nach:</Typography>
        <Select
          value={filter?.question?.id || "none"}
          onChange={handleQuestionChange}
        >
          <MenuItem value={"none"}>Kein Filter</MenuItem>
          {survey?.questions.map((q) => (
            <MenuItem value={q.id}>{q.questionText}</MenuItem>
          ))}
        </Select>
        {filter?.question && (
          <QuestionFilter filter={filter} onChange={onChange} />
        )}
        <Divider />
        {survey?.hasFamily && (
          <Box sx={{ mt: "1rem", display: "flex", flexDirection: "column  " }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filter?.filterFamily || false}
                  onChange={handleFamilyCheckedChange}
                />
              }
              label="Nur Antworten zu Familie mit dieser Nummer:"
            />
            <TextField
              label={"Familiennummer"}
              value={familyNumber || ""}
              onChange={handleFamilyChange}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

