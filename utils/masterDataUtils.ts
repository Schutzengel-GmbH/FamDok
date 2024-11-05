import { IMasterDataType } from "@/pages/api/masterDataType";
import { IMasterData } from "@/pages/api/masterDataType/[masterDataType]/[masterData]";
import { IMasterDataByNumber } from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]";
import { apiDelete, apiPostJson, FetchError } from "@/utils/fetchApiUtils";
import { DataField, MasterData, MasterDataType, Prisma } from "@prisma/client";

export async function createMasterDataType(
  masterDataType: Prisma.MasterDataCreateInput
) {
  const res = await apiPostJson<IMasterDataType, Prisma.MasterDataCreateInput>(
    "/api/masterDataType",
    masterDataType
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError) throw new Error(res.error);
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

  if (res instanceof FetchError) throw new Error(res.error);
  return res.updateRes;
}

export async function deleteMasterDataType(masterDataType: MasterDataType) {
  const res = await apiDelete<IMasterDataByNumber>(
    `/api/masterDataType/${masterDataType.id}`
  ).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError) throw new Error(res.error);
  return res.deleteRes;
}

export async function addDataField(
  masterDataType: MasterDataType,
  dataField: Prisma.DataFieldCreateInput
) {
  const res = await apiPostJson<
    IMasterDataByNumber,
    Prisma.MasterDataTypeUpdateInput
  >(`/api/masterDataType/${masterDataType.id}`, {
    dataFields: { create: dataField },
  }).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError) throw new Error(res.error);
  return res.updateRes;
}

export async function updateDataField(
  masterDataType: MasterDataType,
  dataField: DataField,
  update: Prisma.DataFieldUpdateInput
) {
  const res = await apiPostJson<
    IMasterDataByNumber,
    Prisma.MasterDataTypeUpdateInput
  >(`/api/masterDataType/${masterDataType.id}`, {
    dataFields: { update: { where: { id: dataField.id }, data: update } },
  }).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError) throw new Error(res.error);
  return res.updateRes;
}

export async function deleteDataField(
  masterDataType: MasterDataType,
  dataField: DataField
) {
  const res = await apiPostJson<
    IMasterDataByNumber,
    Prisma.MasterDataTypeUpdateInput
  >(`/api/masterDataType/${masterDataType.id}`, {
    dataFields: { delete: { id: dataField.id } },
  }).catch((e) => {
    throw new Error(e);
  });

  if (res instanceof FetchError) throw new Error(res.error);
  return res.updateRes;
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

  if (res instanceof FetchError) throw new Error(res.error);
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

  if (res instanceof FetchError) throw new Error(res.error);
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

  if (res instanceof FetchError) throw new Error(res.error);
  return res.deleteRes;
}

