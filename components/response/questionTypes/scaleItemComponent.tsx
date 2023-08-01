import { Box, FormControlLabel, Radio } from "@mui/material";

type ScaleItemComponentProps = {
  checked: boolean;
  index: number;
  label: string;
};

export default function ScaleItemComponent({
  checked,
  index,
  label,
}: ScaleItemComponentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", flex: 1 }}>
      <FormControlLabel
        label={label}
        control={<Radio checked={checked} value={index} />}
      />
    </Box>
  );
}
