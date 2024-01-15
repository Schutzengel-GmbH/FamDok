import { FilterType, ResponseFilter } from "@/components/myResponses/filter.t";
import NumFilter from "@/components/myResponses/filterComponents/NumFilter";
import BoolFilter from "@/components/myResponses/filterComponents/boolFilter";
import DateFilter from "@/components/myResponses/filterComponents/dateFilter";
import SelectFilter from "@/components/myResponses/filterComponents/selectFilter";
import TextFilter from "@/components/myResponses/filterComponents/textFilter";
import { Box, Typography } from "@mui/material";

export type QuestionFilterProps = {
  filter: ResponseFilter<FilterType>;
  onChange: (filter: ResponseFilter<FilterType>) => void;
};

export default function QuestionFilter({
  filter,
  onChange,
}: QuestionFilterProps) {
  const component = (() => {
    switch (filter.question.type) {
      case "Text":
        return <TextFilter filter={filter} onChange={onChange} />;
      case "Bool":
        return <BoolFilter filter={filter} onChange={onChange} />;
      case "Int":
      case "Num":
        return <NumFilter filter={filter} onChange={onChange} />;
      case "Date":
        return <DateFilter filter={filter} onChange={onChange} />;
      case "Select":
      case "Scale":
        return <SelectFilter filter={filter} onChange={onChange} />;
    }
  })();

  return (
    <Box>
      <Typography variant="body1">{filter.question.questionText}</Typography>
      {component}
    </Box>
  );
}

