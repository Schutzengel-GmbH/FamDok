import { useConfigRaw } from "@/utils/apiHooks";
import { AppConfiguration, AppConfigurationDict } from "@/utils/appConfigUtils";
import { useTheme } from "@mui/material";
import { createContext, useContext } from "react";

const ConfigContext = createContext<AppConfiguration>(undefined);

export function ConfigProvider({ children }) {
  const { config } = useConfigRaw();
  let configObject = {};

  if (config)
    for (const setting of AppConfigurationDict) {
      configObject[setting.name] =
        config.find((s) => s.name === setting.name)?.value || undefined;
    }
  const value = configObject as AppConfiguration;

  const theme = useTheme();

  return (
    <ConfigContext.Provider value={value}>
      <link
        rel="stylesheet"
        type="text/css"
        href={
          theme.palette.mode === "dark"
            ? "/css/css/tabulator_midnight.css"
            : "/css/css/tabulator_simple.css"
        }
      />
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);

