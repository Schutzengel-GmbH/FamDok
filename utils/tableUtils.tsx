import { FamilyFields } from "@/components/surveyStats/familyFilterComponent";
import {
  FullAnswer,
  FullCollection,
  FullFamily,
  FullMasterData,
  FullMasterDataType,
  FullQuestion,
  FullResponse,
  FullSurvey,
  FullUser,
  IAnswerSelectOtherValue,
} from "@/types/prismaHelperTypes";
import { IFamilyFilter } from "@/utils/filters";
import { getCollectionDataField } from "@/utils/masterDataUtils";
import {
  getAnswerString,
  getEducationString,
  isHigherEducation,
} from "@/utils/utils";
import {
  Answer,
  CollectionType,
  Organization,
  Prisma,
  Question,
  QuestionType,
  SubOrganization,
  User,
} from "@prisma/client";
import { randomBytes, randomInt } from "crypto";
import {
  compareAsc,
  compareDesc,
  differenceInYears,
  isSameDay,
} from "date-fns";
import { title } from "process";
import { ColumnDefinition } from "react-tabulator";
import { Tabulator } from "react-tabulator/lib/types/TabulatorTypes";

type ResponseTableData = {
  id?: string;
  surveyId?: string;
  responseCreatedBy?: FullUser;
  responseCreatedAt?: Date;
  [questionId: string]:
    | string
    | number
    | boolean
    | Date
    | { [selectOptionId: string]: string | boolean }
    | object
    | undefined;
  // family data
} & FamilyTableData &
  MasterDataTableData;

type FamilyTableData = {
  familyNumber?: number;
  beginOfCare?: Date;
  childrenInHousehold?: number;
  location?: string;
  childrenWithDisability?: boolean;
  careGiverWithDisability?: boolean;
  childWithPsychDiagnosis?: boolean;
  caregiverWithPsychDiagnosis?: boolean;
  migrationBackground?: boolean;
  highestEducation?: string;
  otherInstalledProfessionals?: string;
  comingFrom?: string;
  endOfCare?: Date;
};

type MasterDataTableData = {
  number?: number;
  [dataFieldId: string]:
    | string
    | number
    | boolean
    | Date
    | object
    | undefined
    | string[]
    | number[]
    | Date[];
};

export function responsesToAllAnswersTable(
  responses: FullResponse[]
): ResponseTableData[] {
  let result: ResponseTableData[] = [];

  if (!responses) return result;

  for (const response of responses) {
    let data: ResponseTableData = {};

    data.id = response.id;
    data.surveyId = response.surveyId;
    data.responseCreatedBy = {
      ...response.user,
      name:
        response.user?.name || response.user?.email || "Kein Nutzer zugewiesen",
      //@ts-ignore
      subOrganizations: response?.user?.subOrganizations?.map((o) => o.name),
    };
    data.responseCreatedAt = new Date(response.createdAt);

    for (const answer of response.answers) {
      if (answer.question.type === QuestionType.Select)
        data[answer.question.id] = answer.answerSelect.reduce<{
          [id: string]: string | boolean;
        }>((acc, s) => {
          if (s.isOpen)
            return {
              ...acc,
              [s.id]: (
                (answer.answerSelectOtherValues as IAnswerSelectOtherValue[]) ??
                []
              ).find((ov) => ov.selectOptionId === s.id)?.value,
            };
          else return { ...acc, [s.id]: true };
        }, {});
      else {
        switch (answer.question.type) {
          case QuestionType.Date:
            data[answer.question.id] = answer.answerDate
              ? new Date(answer.answerDate)
              : undefined;
            break;
          case QuestionType.Int:
            data[answer.question.id] = answer.answerInt ?? undefined;
            break;
          case QuestionType.Num:
            data[answer.question.id] = answer.answerNum ?? undefined;
            break;
          case QuestionType.Bool:
            data[answer.question.id] = answer.answerBool ?? undefined;
            break;
          case QuestionType.Text:
            data[answer.question.id] = answer.answerText;
            break;
          case QuestionType.Scale:
            data[`${answer.question.id}-value`] = `${
              answer.question.selectOptions.findIndex(
                (o) => o.id === answer.answerSelect[0].id
              ) + 1
            }`;
            data[`${answer.question.id}-text`] = answer.answerSelect[0].value;
            break;
          case QuestionType.Collection:
            data[answer.question.id] = answer.answerCollection[
              getCollectionDataField(answer.answerCollection.type)
            ].map((c) => c.value);
            break;
        }
      }
    }
    if (response.family) {
      data = { ...data, ...getFamilyData(response.family) };
    }
    if (response.masterData) {
      //TODO: should be but actually...
      //@ts-ignore should be fine
      data = { ...data, ...getMasterDataData(response.masterData) };
    }
    result.push(data);
  }

  return result;
}

export function getMasterDataData(
  masterData: FullMasterData
): MasterDataTableData {
  let data: MasterDataTableData = {};
  data["number"] = masterData.number;
  data["createdBy"] = masterData.createdBy;
  for (let answer of masterData.answers) {
    const dataField = masterData.masterDataType.dataFields.find(
      (d) => d.id === answer.dataFieldId
    );
    if (!dataField) break;
    switch (dataField.type) {
      case "Text":
        data[answer.dataFieldId] = answer.answerText;
        break;
      case "Bool":
        data[answer.dataFieldId] = answer.answerBool;
        break;
      case "Int":
        data[answer.dataFieldId] = answer.answerInt;
        break;
      case "Num":
        data[answer.dataFieldId] = answer.answerNum;
        break;
      case "Select":
        data[answer.dataFieldId] = answer.answerSelect.reduce<{
          [id: string]: string | boolean;
        }>((acc, s) => {
          if (s.isOpen)
            return {
              ...acc,
              [s.id]: (
                (answer.selectOtherValues as IAnswerSelectOtherValue[]) ?? []
              ).find((ov) => ov.selectOptionId === s.id)?.value,
            };
          else return { ...acc, [s.id]: true };
        }, {});
        break;
      case "Date":
        data[answer.dataFieldId] = answer.answerDate
          ? new Date(answer.answerDate)
          : undefined;
        break;
      case "Collection":
        data[answer.dataFieldId] = answer.answerCollection
          ? answer.answerCollection[
              getCollectionDataField(answer.answerCollection.type)
            ].map((c) => c.value)
          : undefined;
        break;
    }
  }
  console.log;
  return data;
}

export function getFamilyData(family: FullFamily): FamilyTableData {
  let data = {};
  data["familyNumber"] = family.number;
  data["beginOfCare"] = family.beginOfCare
    ? new Date(family.beginOfCare)
    : undefined;
  data["childrenInHousehold"] = family.childrenInHousehold;
  data["location"] = family.location;
  data["childrenWithDisability"] = family.children?.reduce<boolean>(
    (b, ch) =>
      ch.disability === "Yes" || ch.disability === "Impending" ? (b = true) : b,
    false
  );
  data["careGiverWithDisability"] = family.caregivers?.reduce<boolean>(
    (b, c) =>
      c.disability === "Yes" || c.disability === "Impending" ? (b = true) : b,
    false
  );
  data["childWithPsychDiagnosis"] = family.children?.reduce<boolean>(
    (b, ch) => (ch.psychDiagosis === true ? (b = true) : b),
    false
  );
  data["caregiverWithPsychDiagnosis"] = family.caregivers?.reduce<boolean>(
    (b, c) => (c.psychDiagosis === true ? (b = true) : b),
    false
  );
  data["migrationBackground"] = family.caregivers?.reduce<boolean>(
    (b, c) => (c.migrationBackground === true ? (b = true) : b),
    false
  );
  data["highestEducation"] = family.caregivers?.reduce(
    (prev, c, i, caregivers) => {
      if (i === 0) return getEducationString(c.education);
      else if (isHigherEducation(c.education, caregivers[i - 1].education))
        return getEducationString(c.education);
      else return prev;
    },
    ""
  );
  data["otherInstalledProfessionals"] = family.otherInstalledProfessionals;
  data["comingFrom"] = family.comingFrom?.value || undefined;
  data["endOfCare"] = family.endOfCare ? new Date(family.endOfCare) : undefined;

  data["underage"] = underageCaregiverAtBegin(family);

  data["createdBy"] = {
    ...family.createdBy,
    subOrganizations:
      family?.createdBy?.subOrganizations?.map((o) => o.name) || [],
  };
  data["createdAt"] = new Date(family.createdAt);

  return data;
}

function underageCaregiverAtBegin(family: FullFamily): boolean {
  for (const caregiver of family.caregivers) {
    if (!caregiver.dateOfBirth) break;
    const ageAtStart = differenceInYears(
      new Date(family.beginOfCare),
      new Date(caregiver.dateOfBirth)
    );
    if (ageAtStart < 18) return true;
  }

  return false;
}

function stringMemberFormatter<T>(
  field: keyof T,
  defaultValue?: string
): Tabulator.Formatter {
  return (cell) => {
    if (!cell?.getValue()) return defaultValue || "";
    return cell.getValue()[field];
  };
}

const userFormatter = stringMemberFormatter<User>("name", "Kein Name");

const organizationFormatter = stringMemberFormatter<Organization>(
  "name",
  "Keine Organisation"
);
const subOrganizationFormatter = stringMemberFormatter<SubOrganization>(
  "name",
  "Keine Unterorganisation"
);
const answerFormatter: Tabulator.Formatter = (cell) => {
  const answer = cell.getValue() as FullAnswer;
  if (!answer) return "Keine Antwort";
  const type = answer.question.type;

  switch (type) {
    case "Text":
      return answer.answerText;
    case "Bool":
      return String(answer.answerBool);
    case "Int":
      return String(answer.answerInt);
    case "Num":
      return String(answer.answerNum);
    case "Select":
      return "SELECT NOT IMPLEMENTED";
    case "Date":
      return new Date(answer.answerDate).toLocaleDateString();
    case "Scale":
      return "SCALE NOT IMPLEMENTED";
    default:
      return "";
  }
};

const dateFormatter: Tabulator.Formatter = (
  cell: Tabulator.CellComponent,
  formatterParams,
  onRender
) => {
  const date = cell.getValue() as Date;
  return new Date(date).toLocaleDateString() ?? "";
};

const collectionFormatter: Tabulator.Formatter = (
  cell: Tabulator.CellComponent,
  formatterParams: { collectionType: CollectionType },
  onRender
) => {
  const collection = cell.getValue() as Date[] | string[] | number[];
  if (!collection || collection.length < 1) return "";
  //@ts-ignore
  return collection.reduce<string>((prev, value) => {
    if (formatterParams.collectionType === "Date")
      return prev
        ? prev + "; " + new Date(value).toLocaleDateString()
        : new Date(value).toLocaleDateString();
    else
      return prev
        ? prev + "; " + value.toLocaleString()
        : value.toLocaleString();
  }, "");
};

const dateSorter = (a: Date, b: Date) => {
  const dateA = a ? new Date(a) : new Date("0000-01-01");
  const dateB = b ? new Date(b) : new Date("0000-01-01");
  return compareAsc(dateA, dateB);
};

function stringMemberSorter<T>(field: keyof T) {
  return (a: T, b: T) => {
    if (typeof a[field] !== "string")
      throw new Error(`${typeof a}.${String(field)} is not a string`);
    return (a[field] as string).localeCompare(b[field] as string);
  };
}

const userSorter = stringMemberSorter<User>("name");
const organizationSorter = stringMemberSorter<Organization>("name");
const subOrganizationSorter = stringMemberSorter<SubOrganization>("name");

export const globalOptions = {
  headerSortElement: (row, dir) => {
    if (dir === "asc") return '<span class="fa-solid fa-sort-down"></span>';
    else if (dir === "desc") return '<span class="fa-solid fa-sort-up"></span>';
    else return '<span class="fa-solid fa-sort-down"></span>';
  },
};

export function applyFamilyFilter(filter: IFamilyFilter, value: any): boolean {
  switch (filter.filter) {
    case "equals":
      switch (filter.field as FamilyFields) {
        // number
        case "familyNumber":
        case "childrenInHousehold":
          return value === filter.value;
        // Date
        case "beginOfCare":
        case "endOfCare":
          return isSameDay(new Date(filter.value), new Date(value));
        // string
        case "location":
        case "otherInstalledProfessionals":
        case "highestEducation":
        case "comingFrom":
          return filter.value.toLowerCase() === value?.toLowerCase();
        // boolean
        case "childrenWithDisability":
        case "careGiverWithDisability":
        case "childWithPsychDiagnosis":
        case "caregiverWithPsychDiagnosis":
        case "migrationBackground":
          if (filter.filter === "equals") return value === true;
          else return value !== true;
        default:
          return value === filter.value;
      }
    case "not":
      if (filter.field === "beginOfCare" || filter.field === "endOfCare")
        return !isSameDay(new Date(value), new Date(filter.value));
      return value !== filter.value;
    case "lt":
      return value < filter.value;
    case "lte":
      return value <= filter.value;
    case "gt":
      return value > filter.value;
    case "gte":
      return value >= filter.value;
    case "startsWith":
      return ((value as string) || "").startsWith(filter.value);
    case "endsWith":
      return ((value as string) || "").endsWith(filter.value);
    case "contains":
      return ((value as string) || "")
        .toLowerCase()
        .includes(filter.value?.toLowerCase());
    default:
      return true;
  }
}

export function familyColumnsDefinition(
  survey?: FullSurvey
): ColumnDefinition[] {
  if (survey && !survey.hasFamily) return [];
  else
    return [
      {
        title: "Familie",
        columns: [
          { title: "Familiennummer", field: "familyNumber" },
          {
            title: "Beginn der Betreuung",
            field: "beginOfCare",
            formatter: dateFormatter,
            sorter: dateSorter,
            headerSortTristate: true,
          },
          { title: "Kinder", field: "childrenInHousehold" },
          { title: "Wohnort", field: "location" },
          {
            title: "Kinder mit Behinderung",
            field: "childrenWithDisability",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Kinder mit Psych. Diagnose",
            field: "childWithPsychDiagnosis",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "ElternTeil mit Behinderung",
            field: "careGiverWithDisability",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Elternteil mit Psych. Diagnose",
            field: "caregiverWithPsychDiagnosis",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Migrationshintergrund",
            field: "migrationBackground",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Höchster Bildungsabschluss",
            field: "highestEducation",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Andere installierte Fachkräfte",
            field: "otherInstalledProfessionals",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },

          {
            title: "Zugang über",
            field: "comingFrom",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
          {
            title: "Ende der Betreuung",
            field: "endOfCare",
            formatter: dateFormatter,
            sorter: dateSorter,
            headerSortTristate: true,
          },
          {
            title: "Verantwortlich",
            columns: [
              {
                title: "Fachkraft",
                field: "createdBy.name",
                headerSortTristate: true,
              },
              {
                title: "Organisation",
                field: "createdBy.organization.name",
                headerSortTristate: true,
              },
              {
                title: "Unterorganisation",
                field: "createdBy.subOrganizations",
                formatter: (cell) => {
                  if (!cell?.getValue()) return "";
                  return (cell.getValue() as string[]).reduce(
                    (acc, n) => (acc === "" ? n : acc + ", " + n),
                    ""
                  );
                },
              },
            ],
          },
          {
            title: "Minderjährigkeit bei Betreuungsbeginn",
            field: "underage",
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          },
        ],
      },
    ];
}

export function allResponsesColumnDefinition(): ColumnDefinition[] {
  return [
    {
      title: "Erstellt von",
      columns: [
        {
          title: "Fachkraft",
          field: "responseCreatedBy.name",
          headerSortTristate: true,
        },
        {
          title: "Organisation",
          field: "responseCreatedBy.organization.name",
          headerSortTristate: true,
        },
        {
          title: "Unterorganisation",
          field: "responseCreatedBy.subOrganizations",
          formatter: (cell) => {
            if (!cell?.getValue()) return "";
            return (cell.getValue() as string[]).reduce(
              (acc, n) => (acc === "" ? n : acc + ", " + n),
              ""
            );
          },
        },
      ],
    },
    {
      title: "Erstellt am",
      field: "responseCreatedAt",
      formatter: dateFormatter,
      sorter: dateSorter,
      headerSortTristate: true,
    },
  ];
}

export function masterDataColumnDefinitionsNoSurvey(
  masterDataType: FullMasterDataType
): ColumnDefinition[] {
  return [
    { title: "Nummer", field: "number" },
    ...masterDataType.dataFields.map((dataField): ColumnDefinition => {
      switch (dataField.type) {
        case "Text":
          return {
            title: dataField.text,
            field: dataField.id,
            headerSortTristate: true,
          };
        case "Bool":
          return {
            title: dataField.text,
            field: dataField.id,
            formatter: "tickCross",
            formatterParams: { allowEmpty: true },
            headerSortTristate: true,
          };
        case "Int":
          return {
            title: dataField.text,
            field: dataField.id,
            headerSortTristate: true,
          };
        case "Num":
          return {
            title: dataField.text,
            field: dataField.id,
            headerSortTristate: true,
          };
        case "Select":
          return {
            title: dataField.text,
            columns: dataField.selectOptions.map<ColumnDefinition>(
              (selectOption) => ({
                title: selectOption.value,
                field: `${dataField.id}.${selectOption.id}`,
                formatter: selectOption.isOpen ? "textarea" : "tickCross",
                formatterParams: { allowEmpty: true },
                headerSortTristate: true,
              })
            ),
          };
        case "Date":
          return {
            title: dataField.text,
            field: dataField.id,
            formatter: dateFormatter,
            sorter: dateSorter,
            headerSortTristate: true,
          };
        case "Collection":
          return {
            title: dataField.text,
            field: dataField.id,
            formatter: collectionFormatter,
            formatterParams: { collectionType: dataField.collectionType },
          };
        case "TriggerSurvey":
          return { title: "", visible: false };
        default:
          return { title: "--FEHLER--" };
      }
    }),
    { title: "Verantwortlich", field: "createdBy", formatter: userFormatter },
  ];
}

export function masterDataColumnDefinitions(
  survey: FullSurvey
): ColumnDefinition[] {
  if (survey && !survey.hasMasterData) return [];

  return [
    {
      title: `Stammdatensatz ${survey.masterDataType.name}`,
      columns: [
        { title: "Nummer", field: "number" },
        ...survey.masterDataType.dataFields.map(
          (dataField): ColumnDefinition => {
            switch (dataField.type) {
              case "Text":
                return {
                  title: dataField.text,
                  field: dataField.id,
                  headerSortTristate: true,
                };
              case "Bool":
                return {
                  title: dataField.text,
                  field: dataField.id,
                  formatter: "tickCross",
                  formatterParams: { allowEmpty: true },
                  headerSortTristate: true,
                };
              case "Int":
                return {
                  title: dataField.text,
                  field: dataField.id,
                  headerSortTristate: true,
                };
              case "Num":
                return {
                  title: dataField.text,
                  field: dataField.id,
                  headerSortTristate: true,
                };
              case "Select":
                return {
                  title: dataField.text,
                  columns: dataField.selectOptions.map<ColumnDefinition>(
                    (selectOption) => ({
                      title: selectOption.value,
                      field: `${dataField.id}.${selectOption.id}`,
                      formatter: selectOption.isOpen ? "textarea" : "tickCross",
                      formatterParams: { allowEmpty: true },
                      headerSortTristate: true,
                    })
                  ),
                };
              case "Date":
                return {
                  title: dataField.text,
                  field: dataField.id,
                  formatter: dateFormatter,
                  sorter: dateSorter,
                  headerSortTristate: true,
                };
              case "Collection":
                return {
                  title: dataField.text,
                  field: dataField.id,
                  formatter: collectionFormatter,
                  formatterParams: { collectionType: dataField.collectionType },
                };
              case "TriggerSurvey":
                return { title: "", visible: false };
              default:
                return { title: "--FEHLER--" };
            }
          }
        ),
        {
          title: "Erstellt von",
          columns: [
            {
              title: "Fachkraft",
              field: "createdBy.name",
              headerSortTristate: true,
            },
            {
              title: "Organisation",
              field: "createdBy.organization.name",
              headerSortTristate: true,
            },
            {
              title: "Unterorganisation",
              field: "createdBy.subOrganizations",
              formatter: (cell) => {
                if (!cell?.getValue()) return "";
                return (cell.getValue() as SubOrganization[]).reduce(
                  (acc, n) => (acc === "" ? n.name : acc + ", " + n.name),
                  ""
                );
              },
            },
          ],
        },
      ],
    },
  ];
}

export function allAnswersColumnDefinition(
  survey: FullSurvey
): ColumnDefinition[] {
  return survey.questions.map<ColumnDefinition>((question) => {
    switch (question.type) {
      case QuestionType.Date: {
        return {
          title: question.questionText,
          field: question.id,
          formatter: dateFormatter,
          sorter: dateSorter,
          headerSortTristate: true,
        };
      }
      case QuestionType.Int: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Num: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Bool: {
        return {
          title: question.questionText,
          field: question.id,
          formatter: "tickCross",
          formatterParams: { allowEmpty: true },
          headerSortTristate: true,
        };
      }
      case QuestionType.Text: {
        return {
          title: question.questionText,
          field: question.id,
          headerSortTristate: true,
        };
      }
      case QuestionType.Scale: {
        return {
          title: question.questionText,
          columns: [
            {
              title: "Wert",
              headerSortTristate: true,
              field: `${question.id}-value`,
            },
            { title: "Text", headerSort: false, field: `${question.id}-text` },
          ],
        };
      }
      case QuestionType.Select: {
        return {
          title: question.questionText,
          columns: question.selectOptions.map<ColumnDefinition>(
            (selectOption) => ({
              title: selectOption.value,
              field: `${question.id}.${selectOption.id}`,
              formatter: selectOption.isOpen ? "textarea" : "tickCross",
              formatterParams: { allowEmpty: true },
              headerSortTristate: true,
            })
          ),
        };
      }
      case QuestionType.Collection: {
        return {
          title: question.questionText,
          field: question.id,
          formatter: collectionFormatter,
          formatterParams: { collectionType: question.collectionType },
        };
      }
    }
  });
}
export function getWhereInputFromFamilyFilters(
  familyFilters: IFamilyFilter[]
): Prisma.FamilyWhereInput {
  let whereInputs: Prisma.FamilyWhereInput[] = [];

  for (const filter of familyFilters) {
    if (!filter?.field) break;

    switch (filter.field as FamilyFields) {
      case "familyNumber":
        whereInputs.push({ number: { [filter.filter]: filter.value } });
        break;
      case "childrenInHousehold":
        whereInputs.push({
          [filter.field]: {
            [filter.filter]: filter.value,
          },
        });
        break;

      case "beginOfCare":
      case "endOfCare":
        whereInputs.push({
          [filter.field]: {
            [filter.filter]: filter.value,
          },
        });
        break;

      case "otherInstalledProfessionals":
      case "location":
        whereInputs.push({
          [filter.field]: {
            [filter.filter]: filter.value,
            mode: "insensitive",
          },
        });
        break;

      case "careGiverWithDisability":
        if (filter.filter === "equals")
          whereInputs.push({
            caregivers: { some: { disability: { in: ["Yes", "Impending"] } } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            caregivers: {
              none: { disability: { in: ["Yes", "Impending"] } },
            },
          });
        break;
      case "caregiverWithPsychDiagnosis":
        if (filter.filter === "equals")
          whereInputs.push({
            caregivers: { some: { psychDiagosis: true } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            caregivers: { none: { psychDiagosis: true } },
          });
        break;
      case "migrationBackground":
        if (filter.filter === "equals")
          whereInputs.push({
            caregivers: { some: { migrationBackground: true } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            caregivers: { none: { migrationBackground: true } },
          });
        break;

      case "childrenWithDisability":
        if (filter.filter === "equals")
          whereInputs.push({
            children: { some: { disability: { in: ["Yes", "Impending"] } } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            children: { none: { disability: { in: ["Yes", "Impending"] } } },
          });
        break;

      case "childWithPsychDiagnosis":
        if (filter.filter === "equals")
          whereInputs.push({
            children: { some: { psychDiagosis: true } },
          });
        if (filter.filter === "not")
          whereInputs.push({
            children: { none: { psychDiagosis: true } },
          });
        break;
      case "createdBy":
        whereInputs.push({ createdBy: { id: filter.value } });
        break;
      case "createdByOrgOrSubOrg":
        const org = filter?.value?.organization;
        const subOrg = filter?.value?.subOrganization;
        whereInputs.push({
          createdBy: {
            organizationId: org?.id,
            subOrganizations: subOrg ? { some: { id: subOrg?.id } } : undefined,
          },
        });
        break;
    }
  }

  if (whereInputs?.length < 1) return undefined;
  return { AND: whereInputs };
}

export const dashboardPerUserColumnDefinitions: ColumnDefinition[] = [
  {
    title: "Benutzer*in",
    field: "user.name",
    headerSortTristate: true,
  },
  { title: "Anzahl Antworten", field: "num" },
];

type DashboardPerUserData = {
  user: FullUser;
  num: number;
};

export function answersPerUserDashboardData(
  responses: FullResponse[]
): DashboardPerUserData[] {
  let data: DashboardPerUserData[] = [];

  if (!responses) return data;

  for (const response of responses) {
    const i = data.findIndex((d) => d.user?.id === response.user?.id);
    if (i >= 0) {
      data[i].num++;
    } else {
      data.push({ user: response.user, num: 1 });
    }
  }

  return data;
}

export const dashboardPerOrgColumnDefinitions: ColumnDefinition[] = [
  {
    title: "Organisation",
    field: "organization.name",
    headerSortTristate: true,
  },
  { title: "Anzahl Antworten", field: "num" },
];

type DashboardPerOrgData = {
  organization: Organization;
  num: number;
};

export function answersPerOrgDashboardData(
  responses: FullResponse[]
): DashboardPerOrgData[] {
  let data: DashboardPerOrgData[] = [{ organization: null, num: 0 }];

  if (!responses) return data;

  for (const response of responses) {
    if (!response.user?.organization) {
      data[0].num++;
    } else {
      const i = data.findIndex(
        (d) => d.organization?.id === response.user?.organizationId
      );
      if (i >= 0) {
        data[i].num++;
      } else {
        data.push({
          organization: response.user?.organization,
          num: 1,
        });
      }
    }
  }

  return data;
}

export const dashboardPerSubOrgColumnDefinitions: ColumnDefinition[] = [
  {
    title: "Unterorganisation",
    field: "subOrganization.name",
    headerSortTristate: true,
  },
  { title: "Anzahl Antworten", field: "num" },
];

type DashboardPerSubOrgData = {
  subOrganization: SubOrganization;
  num: number;
};

export function answersPerSubOrgDashboardData(
  responses: FullResponse[]
): DashboardPerSubOrgData[] {
  let data: DashboardPerSubOrgData[] = [{ subOrganization: null, num: 0 }];

  if (!responses) return data;

  for (const response of responses) {
    if (
      !response.user?.subOrganizations ||
      response.user.subOrganizations.length === 0
    ) {
      data[0].num++;
    } else {
      const i = data.findIndex((d) =>
        response.user?.subOrganizations?.find(
          (s) => s.id === d.subOrganization?.id
        )
      );
      if (i >= 0) {
        data[i].num++;
      } else {
        data.push({
          subOrganization: response.user?.subOrganizations[0],
          num: 1,
        });
      }
    }
  }

  return data;
}

//TODO:
export const dashboardPerQuestionColumnDefinitions: ColumnDefinition[] = [
  {
    title: "Antwort",
    field: "answerString",
    formatter: "plaintext",
    headerSortTristate: true,
  },
  { title: "Anzahl Antworten", field: "num" },
];

type DashboardPerQuestionData = {
  answerString: string;
  num: number;
};

export function answersPerQuestionDashboardData(
  responses: FullResponse[],
  question: FullQuestion
): DashboardPerQuestionData[] {
  let data: DashboardPerQuestionData[] = [
    { answerString: "Keine Antwort", num: 0 },
  ];
  if (!question || !responses) return data;

  for (const response of responses) {
    const answer = response.answers.find((a) => a.questionId === question.id);
    if (!answer) data[0].num++;
    else {
      if (question.type === "Select") {
        if (answer.answerSelect)
          for (const selectOption of answer.answerSelect) {
            const i = data.findIndex(
              (d) => d.answerString === selectOption.value
            );
            if (i >= 0) data[i].num++;
            else data.push({ answerString: selectOption.value, num: 1 });
          }

        if (answer.answerSelectOtherValues)
          for (const otherValue of answer.answerSelectOtherValues as IAnswerSelectOtherValue[]) {
            const i = data.findIndex(
              (d) => d.answerString === otherValue.value
            );
            if (i >= 0) data[i].num++;
            else data.push({ answerString: otherValue.value, num: 1 });
          }
      } else {
        const i = data.findIndex(
          (d) => d.answerString === getAnswerString(answer)
        );
        if (i >= 0) data[i].num++;
        else data.push({ answerString: getAnswerString(answer), num: 1 });
      }
    }
  }

  return data;
}

export const dashboardMDCountColumnDefinitions: ColumnDefinition[] = [
  {
    title: "Nummer",
    field: "number",
    sorter: "alphanum",
    formatter: (cell) => {
      return cell.getValue() === "unique"
        ? "Anzahl Eindeutig"
        : cell.getValue();
    },
  },
  { title: "Anzahl", field: "count" },
];

type DashboardMDData = {
  number: number | "unique";
  count: number;
};

export function masterDataDashboardData(
  responses: FullResponse[]
): DashboardMDData[] {
  let uniqueMDNumbers = new Set(
    responses?.filter((r) => r.masterDataNumber)?.map((r) => r.masterDataNumber)
  );
  let masterDataNumbers = responses
    ?.filter((r) => r.masterDataNumber)
    .map((r) => r.masterDataNumber);

  return [
    { number: "unique", count: uniqueMDNumbers.size },
    ...uniqueMDNumbers.values().map((u) => ({
      number: u,
      count: masterDataNumbers.filter((n) => n === u).length,
    })),
  ];
}
