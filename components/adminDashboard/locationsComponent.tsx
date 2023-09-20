import LocationCard from "@/components/adminDashboard/locationCard";
import NewLocationComponent from "@/components/adminDashboard/newLocationComponent";
import ErrorPage from "@/components/utilityComponents/error";
import { useLocations } from "@/utils/apiHooks";
import { sortByStringProperty } from "@/utils/utils";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LocationsComponent() {
  const { locations, isLoading, error, mutate } = useLocations();

  if (isLoading) return <CircularProgress />;

  if (error) return <ErrorPage message={error} />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Typography maxWidth={700}>
        Hier können Vorgaben über die auswählbaren Wohnorte von angelegten
        Familien gemacht werden. Wenn hier keine Angaben gemacht werden, ist der
        Wohnort frei wählbar, andernfalls kann nur zwischen diesen Vorgaben
        gewählt werden (oder keine Angabe gemacht werden).
      </Typography>
      {locations.sort(sortByStringProperty("name")).map((l) => (
        <LocationCard location={l} onChange={mutate} />
      ))}
      <NewLocationComponent onChange={mutate} />
    </Box>
  );
}

