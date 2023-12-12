export interface AppConfiguration {
  endOfCareAutoSurveyId: string;
}

export const AppConfigurationDict: {
  name: string;
  type: "string" | "boolean";
}[] = [
  {
    name: "endOfCareAutoSurveyId",
    type: "string",
  },
];
