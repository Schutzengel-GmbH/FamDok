import { Paper, Box, Typography } from "@mui/material";
import { Child } from "@prisma/client";
import { getAge } from "@/utils/utils";

interface ChildDisplayBarProps {
  child: Partial<Child>;
}

export default function ChildDisplayBar({ child }: ChildDisplayBarProps) {
  return (
    <Box
      sx={{
        mt: "1rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        p: ".25rem",
      }}
    >
      <Typography sx={{ ml: "1rem", fontWeight: "bold" }} variant="body1">
        {`Kind (Id.Nr. ${child.number})` || "ungespeichertes Kind"}
      </Typography>
      <Typography sx={{ ml: "1rem", fontWeight: "bold" }} variant="body1">
        {child.dateOfBirth
          ? `Alter: ${getAge(new Date(child.dateOfBirth))}`
          : "Alter unbekannt"}
      </Typography>
    </Box>
  );
}
