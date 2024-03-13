import { FullResponse, FullSurvey } from "@/types/prismaHelperTypes";
import { useUsers } from "@/utils/apiHooks";
import { Box, Typography } from "@mui/material";

type ResponsesPerUserProps = {
  survey: FullSurvey;
  responses: FullResponse[];
};

export default function ResponsesPerUser({
  survey,
  responses,
}: ResponsesPerUserProps) {
  const { users } = useUsers();

  return (
    <Box>
      {users?.map((u) => (
        <Typography key={u.id}>
          {u.name}: {responses?.filter((r) => r.userId === u.id).length}
        </Typography>
      ))}
    </Box>
  );
}
