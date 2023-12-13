import SelectSurveySettingComponent from "@/components/adminDashboard/settingComponents/selectSurveySetting";
import StringSettingComponent from "@/components/adminDashboard/settingComponents/stringSetting";
import useToast from "@/components/notifications/notificationContext";
import { useConfigRaw } from "@/utils/apiHooks";
import { AppConfiguration, AppConfigurationDict } from "@/utils/appConfigUtils";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function SettingsPageComponent() {
  const [settings, setSettings] = useState<Partial<AppConfiguration>>();

  const { config, mutate } = useConfigRaw();

  useEffect(() => {
    const configObject: Record<string, any> = config?.reduce((prev, value) => {
      return { ...prev, [value.name]: value.value };
    }, {});
    setSettings(configObject);
  }, [config]);

  const { addToast } = useToast();

  async function updateSettings() {
    for (const setting of AppConfigurationDict) {
      const res = await fetch(`/api/config/${setting.name}`, {
        method: "POST",
        body: JSON.stringify({
          name: setting.name,
          value: settings[setting.name],
        }),
      });
      if (!res.ok)
        addToast({ message: "Fehler beim Update", severity: "error" });
      mutate();
    }
  }

  const noChanges =
    settings &&
    Object.keys(settings).reduce(
      (prev, key) =>
        prev && settings[key] === config.find((c) => c.name === key).value,
      true
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <SelectSurveySettingComponent
        title={"Automatische Umfrage nach Abschluss"}
        name={"endOfCareAutoSurveyId"}
        id={settings?.endOfCareAutoSurveyId || "none"}
        onChange={(name, value) => setSettings({ ...settings, [name]: value })}
      />
      <Button variant="contained" disabled={noChanges} onClick={updateSettings}>
        Update
      </Button>
    </Box>
  );
}
