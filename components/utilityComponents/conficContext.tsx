import { useConfigRaw } from "@/utils/apiHooks";
import { AppConfiguration, AppConfigurationDict } from "@/utils/appConfigUtils";
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

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
