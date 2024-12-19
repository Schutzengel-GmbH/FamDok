import {
  FullAnswer,
  FullDataField,
  FullDataFieldAnswer,
  FullFamily,
  FullMasterData,
  FullQuestion,
  FullResponse,
  IAnswerSelectOtherValues,
} from "@/types/prismaHelperTypes";
import {
  getAge,
  getBoolString,
  getDisabilityString,
  getEducationString,
  getGenderString,
} from "@/utils/utils";
import { Answer, DataField, Question, SelectOption } from "@prisma/client";

export function getMasterDataJson(masterData: FullMasterData[]) {
  let humanReadable: object[] = [];

  for (let m of masterData) {
    let obj: any = {};
    obj.nummer = m.number;
    for (let dataField of m.masterDataType.dataFields) {
      obj[dataField.text] = getDataFieldAnswer(
        m.answers.find((a) => a.dataFieldId === dataField.id),
        dataField
      );
    }

    obj.verantwortlich = {
      name: m.createdBy.name,
      email: m.createdBy.email,
      organisation: m.createdBy.organization.name,
    };

    humanReadable.push(obj);
  }

  return JSON.stringify(humanReadable);
}

export function getFamiliesJson(families: FullFamily[]) {
  let humanReadable: object[] = [];

  for (const family of families) {
    let kinder = family?.children?.reduce(
      (prev, curr, i) => ({
        ...prev,
        [i + 1]: {
          alter: getAge(curr.dateOfBirth),
          geschlecht: getGenderString(curr.gender),
          behinderung: getDisabilityString(curr.disability),
          mehrling: getBoolString(curr.isMultiple),
          fruehgeburt: getBoolString(curr.isPremature),
          psych_diagnose: getBoolString(curr.psychDiagosis),
        },
      }),
      {}
    );

    let bezugspersonen = family?.caregivers?.reduce(
      (prev, curr, i) => ({
        ...prev,
        [i + 1]: {
          alter: getAge(curr.dateOfBirth),
          geschlecht: getGenderString(curr.gender),
          behinderung: getDisabilityString(curr.disability),
          migrationshintergrund: getBoolString(curr.migrationBackground),
          bildungsabschluss: getEducationString(curr.education),
          psych_diagnose: getBoolString(curr.psychDiagosis),
        },
      }),
      {}
    );

    let verantwortlich = {
      organisation: family.createdBy?.organization?.name || "keine",
      unterorganisationen:
        family.createdBy?.subOrganizations?.map((s) => s.name) || [],
    };

    humanReadable.push({
      familiennummer: family.number,
      betreuungsbeginn: family.beginOfCare,
      betreuungsende: family.endOfCare,
      anzahl_kinder: family.childrenInHousehold,
      andere_fachkraefte: family.otherInstalledProfessionals,
      wohnort: family.location,
      zugang_ueber: family.comingFrom?.value || family.comingFromOtherValue,
      kinder,
      bezugspersonen,
      verantwortlich,
    });
  }

  return JSON.stringify(humanReadable);
}

export function getDataFieldAnswer(
  dataFieldAnswer: FullDataFieldAnswer,
  dataField: FullDataField
) {
  switch (dataField.type) {
    case "Text":
      return dataFieldAnswer?.answerText || null;
    case "Bool":
      return dataFieldAnswer?.answerBool || null;
    case "Int":
      return dataFieldAnswer?.answerInt || null;
    case "Num":
      return dataFieldAnswer?.answerNum || null;
    case "Select":
      let ans = [];
      for (let option of dataField.selectOptions) {
        let op = dataFieldAnswer?.answerSelect.find((o) => o.id === option.id);
        if (option.isOpen) {
          if (op)
            ans.push(
              (
                dataFieldAnswer?.selectOtherValues as IAnswerSelectOtherValues
              )?.find((v) => v.selectOptionId === option.id).value
            );
        } else if (op) ans.push(op.value);
      }
      return ans.length > 0 ? ans : null;
    case "Date":
      return dataFieldAnswer?.answerDate || null;
    case "Collection":
      switch (dataFieldAnswer?.answerCollection.type) {
        case "Text":
          return (
            dataFieldAnswer?.answerCollection.collectionDataString.map(
              (a) => a.value
            ) || null
          );
        case "Int":
          return (
            dataFieldAnswer?.answerCollection.collectionDataInt.map(
              (a) => a.value
            ) || null
          );
        case "Num":
          return (
            dataFieldAnswer?.answerCollection.collectionDataFloat.map(
              (a) => a.value
            ) || null
          );
        case "Date":
          return (
            dataFieldAnswer?.answerCollection.collectionDataDate.map(
              (a) => a.value
            ) || null
          );
      }
  }
}

export function getFullResponseJson(data: FullResponse[]) {
  let humanReadableRes: object[] = [];

  for (let response of data) {
    let obj = response.answers.reduce(
      (prev, curr, i) => ({
        ...prev,
        [curr.question.questionText]: getAnswer(curr),
      }),
      {}
    );

    // let kinder = response.family?.children?.reduce(
    //   (prev, curr, i) => ({
    //     ...prev,
    //     [i + 1]: {
    //       alter: getAge(curr.dateOfBirth),
    //       geschlecht: getGenderString(curr.gender),
    //       behinderung: getDisabilityString(curr.disability),
    //       mehrling: getBoolString(curr.isMultiple),
    //       fruehgeburt: getBoolString(curr.isPremature),
    //       psych_diagnose: getBoolString(curr.psychDiagosis),
    //     },
    //   }),
    //   {}
    // );

    // let bezugspersonen = response.family?.caregivers?.reduce(
    //   (prev, curr, i) => ({
    //     ...prev,
    //     [i + 1]: {
    //       alter: getAge(curr.dateOfBirth),
    //       geschlecht: getGenderString(curr.gender),
    //       behinderung: getDisabilityString(curr.disability),
    //       migrationshintergrund: getBoolString(curr.migrationBackground),
    //       bildungsabschluss: getEducationString(curr.education),
    //       psych_diagnose: getBoolString(curr.psychDiagosis),
    //     },
    //   }),
    //   {}
    // );

    obj["verantwortlich"] = {
      name: response.user?.name || "",
      organisation: response.user?.organization?.name || "keine",
      unterorganisationen:
        response.user?.subOrganizations?.map((s) => s.name) || [],
    };

    // obj["familie"] = response.family
    //   ? {
    //       ["familiennummer"]: response.family.number,
    //       kinder,
    //       bezugspersonen,
    //       betreuungsbeginn: response.family.beginOfCare,
    //       betreuungsende: response.family.endOfCare || "",
    //     }
    //   : undefined;

    if (response.masterData) {
      let masterDataObj = {};

      masterDataObj[`${response.masterDataMasterDataTypeName}-nummer`] =
        response.masterData.number;

      for (let answer of response.masterData.answers) {
        let dataField = response.masterData.masterDataType.dataFields.find(
          (df) => df.id === answer.dataFieldId
        );
        masterDataObj[dataField.text] = getDataFieldAnswer(answer, dataField);
      }

      obj[response.masterData.masterDataTypeName] = masterDataObj;
    }

    humanReadableRes.push(obj);
  }

  return JSON.stringify(humanReadableRes, null, 2);
}

function getAnswer(
  a: FullAnswer & {
    question: Question & { selectOptions: SelectOption[] };
    answerSelect: SelectOption[];
  }
) {
  switch (a.question.type) {
    case "Text":
      return a.answerText;
    case "Bool":
      return a.answerBool;
    case "Int":
      return a.answerInt;
    case "Num":
      return a.answerNum;
    case "Select":
      let ans = [];
      for (let option of a.question.selectOptions) {
        let op = a.answerSelect.find((o) => o.id === option.id);
        if (option.isOpen) {
          if (op)
            ans.push(
              (a.answerSelectOtherValues as IAnswerSelectOtherValues)?.find(
                (v) => v.selectOptionId === option.id
              ).value
            );
        } else if (op) ans.push(op.value);
      }
      return ans;
    case "Date":
      return a.answerDate;
    case "Scale":
      return (
        a.question.selectOptions.findIndex(
          (o) => o.id === a.answerSelect[0]?.id
        ) + 1
      );
    case "Collection":
      switch (a.answerCollection.type) {
        case "Text":
          return a.answerCollection.collectionDataString.map((a) => a.value);
        case "Int":
          return a.answerCollection.collectionDataInt.map((a) => a.value);
        case "Num":
          return a.answerCollection.collectionDataFloat.map((a) => a.value);
        case "Date":
          return a.answerCollection.collectionDataDate.map((a) => a.value);
      }
  }
}

