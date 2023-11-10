import { GridColDef } from "@mui/x-data-grid";

export enum Fields {
  number = "family.number",
  beginOfCare = "family.beginOfCare",
  endOfCare = "family.endOfCare",
  hasChildDisability = "hasChildDisability",
  hasCaregiverDisability = "hasCaregiverDisability",
  hasMigrationBackground = "hasMigrationBackground",
  highestEducation = "highestEducation",
  hasCaregiverPsychDiagnosis = "hasCaregiverPsychDiagnosis",
  hasChildPsychDiagnosis = "hasChildPsychDiagnosis",
  childrenInHousehold = "childrenInHousehold",
  location = "location",
  otherInstalledProfessionals = "otherInstalledProfessionals",
  comingFrom = "comingFrom",
}

export const optionalFields: GridColDef[] = [
  { field: Fields.number, width: 100, headerName: "Familiennummer" },
  {
    field: Fields.beginOfCare,
    width: 100,
    headerName: "Familie aufgenommen am",
    type: "date",
  },
  {
    field: Fields.childrenInHousehold,
    width: 100,
    headerName: "Anzahl Kinder",
    type: "number",
  },
  {
    field: Fields.location,
    width: 100,
    headerName: "Wohnort",
    type: "string",
  },
  {
    field: Fields.hasChildDisability,
    width: 100,
    headerName: "Kinder mit Behinderung",
    type: "number",
  },
  {
    field: Fields.hasCaregiverDisability,
    width: 100,
    headerName: "Elternteile mit Behinderung",
    type: "number",
  },
  {
    field: Fields.hasCaregiverPsychDiagnosis,
    width: 100,
    headerName: "Psych. Diagnose (Eltern)",
    type: "boolean",
  },
  {
    field: Fields.hasChildPsychDiagnosis,
    width: 100,
    headerName: "Psych. Diagnose (Kind)",
    type: "boolean",
  },
  {
    field: Fields.hasMigrationBackground,
    width: 100,
    headerName: "Migrationshintergrund?",
    type: "boolean",
  },
  {
    field: Fields.highestEducation,
    width: 100,
    headerName: "Höchster Abschluss",
    type: "string",
  },
  {
    field: Fields.otherInstalledProfessionals,
    width: 100,
    headerName: "Andere Fachkräfte",
    type: "string",
  },
  {
    field: Fields.comingFrom,
    width: 100,
    headerName: "Zugang über",
    type: "string",
  },
  {
    field: Fields.endOfCare,
    width: 100,
    headerName: "Betreuung beendet am",
    type: "date",
  },
];
