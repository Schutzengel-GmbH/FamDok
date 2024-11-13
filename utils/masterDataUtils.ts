import { IDataFieldState } from "@/components/masterDataTypes/editDataFieldDialog";
import { IMasterDataType } from "@/pages/api/masterDataType";
import {
  IMasterDataTypeByID,
  IMasterDataTypeByIdBody,
} from "@/pages/api/masterDataType/[masterDataType]";
import { IMasterData } from "@/pages/api/masterDataType/[masterDataType]/[masterData]";
import { IMasterDataByNumber } from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]";
import { apiDelete, apiPostJson, FetchError } from "@/utils/fetchApiUtils";
import {
  CollectionType,
  DataField,
  DataFieldAnswer,
  DataFieldType,
  MasterData,
  MasterDataType,
  Prisma,
} from "@prisma/client";

export async function createMasterDataType(
  masterDataType: Prisma.MasterDataTypeCreateInput
) {
  const res = await apiPostJson<
    IMasterDataType,
    Prisma.MasterDataTypeCreateInput
  >("/api/masterDataType", masterDataType).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.masterDataType;
}

export async function updateMasterDataType(
  masterDataType: MasterDataType,
  update: Prisma.MasterDataTypeUpdateInput
) {
  const res = await apiPostJson<
    IMasterDataByNumber,
    Prisma.MasterDataTypeUpdateInput
  >(`/api/masterDataType/${masterDataType.id}`, update).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.updateRes;
}

export async function deleteMasterDataType(masterDataType: MasterDataType) {
  const res = await apiDelete<IMasterDataByNumber>(
    `/api/masterDataType/${masterDataType.id}`
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.deleteRes;
}

export async function addDataField(
  masterDataTypeId: string,
  dataField: Prisma.DataFieldCreateInput
) {
  const res = await apiPostJson<IMasterDataTypeByID, IMasterDataTypeByIdBody>(
    `/api/masterDataType/${masterDataTypeId}`,
    {
      update: { dataFields: { create: dataField } },
    }
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.update;
}

export async function updateDataField(
  dataField: DataField,
  dataFieldUpdate: Prisma.DataFieldUpdateInput,
  selectOptions?: {
    id?: string;
    value: string;
    isOpen?: boolean;
    info?: string;
  }[]
) {
  const res = await apiPostJson<IMasterDataTypeByID, IMasterDataTypeByIdBody>(
    `/api/masterDataType/${dataField.masterDataTypeId}`,
    {
      dataFieldId: dataField.id,
      dataFieldUpdate: dataFieldUpdate,
      selectOptions,
    }
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.update;
}

export async function deleteDataField(
  masterDataTypeId: string,
  dataField: DataField
) {
  const res = await apiPostJson<IMasterDataTypeByID, IMasterDataTypeByIdBody>(
    `/api/masterDataType/${masterDataTypeId}`,
    { dataFieldsToDelete: [dataField] }
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.update;
}

export async function addMasterData(
  masterDataType: MasterDataType,
  masterData: Prisma.MasterDataCreateInput
) {
  const res = await apiPostJson<IMasterData, Prisma.MasterDataCreateInput>(
    `/api/masterDataType/${masterDataType.id}/masterData`,
    masterData
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.createRes;
}

export async function updateMasterData(
  masterDataType: MasterDataType,
  masterData: MasterData,
  update: Prisma.MasterDataUpdateInput
) {
  const res = await apiPostJson<
    IMasterDataByNumber,
    Prisma.MasterDataUpdateInput
  >(
    `/api/masterDataType/${masterDataType.id}/masterData/${masterData.number}`,
    update
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.updateRes;
}

export async function deleteMasterData(
  masterDataType: MasterDataType,
  masterData: MasterData
) {
  const res = await apiDelete<IMasterDataByNumber>(
    `/api/masterDataType/${masterDataType.id}/masterData/${masterData.number}`
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.deleteRes;
}

export async function addDataFieldAnswers(
  masterDataTypeId: string,
  masterDataNumber: string,
  answersToDelete: { id: string }[],
  answers: Prisma.DataFieldAnswerCreateManyMasterDataInput[]
) {
  const res = await apiPostJson<
    IMasterDataByNumber,
    Prisma.MasterDataUpdateInput
  >(`/api/masterDataType/${masterDataTypeId}/masterData/${masterDataNumber}`, {
    answers: { delete: answersToDelete, createMany: { data: answers } },
  }).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError || res.error) throw new Error(res.error);
  return res.updateRes;
}

export function getDataFieldTypeName(type: DataFieldType): string {
  switch (type) {
    case "Text":
      return "Text";
    case "Bool":
      return "Ja/Nein";
    case "Int":
      return "Ganze Zahl";
    case "Num":
      return "Zahl";
    case "Select":
      return "Auswahl";
    case "Date":
      return "Datum";
    case "Collection":
      return "Sammlung";
    default:
      return type;
  }
}

export function getCollectionTypeName(type: CollectionType): string {
  switch (type) {
    case "Text":
      return "Text";
    case "Int":
      return "Ganze Zahl";
    case "Num":
      return "Zahl";
    case "Date":
      return "Datum";
    default:
      return type as string;
  }
}
