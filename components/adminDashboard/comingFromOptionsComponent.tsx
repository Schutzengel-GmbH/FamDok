import ComingFromOptionCard from "@/components/adminDashboard/comingFromOptionCard";
import NewComingFromOptionComponent from "@/components/adminDashboard/newComingFromOptionComponent";
import NewLocationComponent from "@/components/adminDashboard/newLocationComponent";
import ErrorPage from "@/components/utilityComponents/error";
import { useComingFromOptions } from "@/utils/apiHooks";
import { sortByStringProperty } from "@/utils/utils";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function ComingFromOptionsComponent() {
  const { comingFromOptions, isLoading, error, mutate } =
    useComingFromOptions();

  if (isLoading) return <CircularProgress />;

  if (error) return <ErrorPage message={error} />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Typography maxWidth={700}>
        Hier können Vorgaben über die auswählbaren Optionen für den Zugang der
        Familien gemacht werden.
      </Typography>
      {comingFromOptions.sort(sortByStringProperty("value")).map((l) => (
        <ComingFromOptionCard comingFromOption={l} onChange={mutate} />
      ))}
      <NewComingFromOptionComponent onChange={mutate} />
    </Box>
  );
}

