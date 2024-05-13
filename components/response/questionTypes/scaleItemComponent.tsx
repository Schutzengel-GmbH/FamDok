import { Box, FormControlLabel, Radio } from "@mui/material";

type ScaleItemComponentProps = {
  checked: boolean;
  index: number;
  label: string;
  onClick: () => void;
};

export default function ScaleItemComponent({
  checked,
  index,
  label,
  onClick
}: ScaleItemComponentProps) {
  return (
    <Box onClick={onClick} sx={{ display: "flex", flexDirection: "row", flex: 1 }}>
      <FormControlLabel
        label={label}
        control={<Radio checked={checked} value={index} />}
      />
    </Box>
  );
}