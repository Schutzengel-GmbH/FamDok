export interface AppConfiguration {
  endOfCareAutoSurveyId: string;
  maintenanceMessage: string;
  cookieOKMessage: string;
}

export const AppConfigurationDict: {
  name: string;
  type: "string" | "boolean";
}[] = [
  {
    name: "endOfCareAutoSurveyId",
    type: "string",
  },
  {
    name: "maintenanceMessage",
    type: "string",
  },
  {
    name: "cookieOKMessage",
    type: "string",
  },
];
