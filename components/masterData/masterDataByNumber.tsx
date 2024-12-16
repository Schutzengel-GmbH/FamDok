import CreatedByComponent from "@/components/masterData/createdByComponent";
import DataFieldCard from "@/components/masterData/dataFieldCard";
import useToast from "@/components/notifications/notificationContext";
import UnsavedChangesComponent from "@/components/response/unsavedChangesComponent";
import ConfirmDialog from "@/components/utilityComponents/confirmDialog";
import { IMasterDataByNumber } from "@/pages/api/masterDataType/[masterDataType]/[masterData]/[number]";
import { FullDataField, FullDataFieldAnswer } from "@/types/prismaHelperTypes";
import { useMasterDataByNumber } from "@/utils/apiHooks";
import { useUserData } from "@/utils/authUtils";
import { apiDelete } from "@/utils/fetchApiUtils";
import {
  submitMasterDataAnswers,
  updateMasterDataCreatedBy,
} from "@/utils/masterDataUtils";
import { DeleteForever } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface MasterDataByNumberProps {
  masterDataTypeId: string;
  masterDataNumber: string;
}

export default function MasterDataByNumber({
  masterDataNumber,
  masterDataTypeId,
}: MasterDataByNumberProps) {
  const { masterData, error, isLoading, mutate } = useMasterDataByNumber(
    masterDataTypeId,
    parseInt(masterDataNumber)
  );
  const [masterDataAnswersState, setMasterDataAnswersState] = useState<
    Partial<FullDataFieldAnswer>[]
  >(masterData?.answers || []);
  const [currentUser, setCurrentUser] = useState<User>(masterData?.createdBy);
  const { addToast } = useToast();

  const { user } = useUserData();

  const canDelete = user && ["ADMIN", "CONTROLLER"].includes(user.role);

  const handleDelete = async () => {
    const res = await apiDelete<IMasterDataByNumber>(
      `/api/masterDataType/${masterDataTypeId}/masterData/${masterDataNumber}`
    );
    setDeleteOpen(false);
    router.push("/masterData");
  };

  useEffect(() => {
    setMasterDataAnswersState(masterData?.answers || []);
    setCurrentUser(masterData?.createdBy);
  }, [masterData]);

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const handleAnswerChanged = (
    dataField: FullDataField,
    answer: Partial<FullDataFieldAnswer>
  ) => {
    setUnsavedChanges(true);
    if (masterDataAnswersState?.find((a) => a.dataFieldId === dataField.id))
      setMasterDataAnswersState(
        masterDataAnswersState?.map((a) =>
          a.dataFieldId === dataField.id ? answer : a
        )
      );
    else
      setMasterDataAnswersState([
        ...masterDataAnswersState,
        { ...answer, dataFieldId: dataField.id },
      ]);
  };

  const router = useRouter();

  const handleSaveUser = async () => {
    try {
      const res = await updateMasterDataCreatedBy(
        masterData.masterDataTypeId,
        masterData.number,
        currentUser
      );
      if (res.error)
        addToast({
          message: `Fehler beim Speichern eines Users: ${res.error}`,
          severity: "error",
        });
      else
        addToast({
          message: "Verantwortlicher User geändert",
          severity: "success",
        });
    } catch (error) {
      addToast({
        message: `Fehler beim Speichern eines Users: ${error}`,
        severity: "error",
      });
    }
    mutate();
  };

  const saveChanges = async () => {
    try {
      const res = await submitMasterDataAnswers(
        masterDataTypeId,
        Number(masterDataNumber),
        masterDataAnswersState
      );
      setUnsavedChanges(false);
      router.push("/masterData");
      mutate();
    } catch (e) {}
  };

  const canEdit = !(
    user?.role === "USER" && masterData?.createdBy.id !== user.id
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <Typography variant="h4">
        {masterData?.masterDataTypeName} - {masterData?.number}
      </Typography>
      <Box
        sx={{
          position: "sticky",
          alignSelf: "flex-start",
          top: "4.5rem",
          zIndex: "100",
          minWidth: "100%",
        }}
      >
        <UnsavedChangesComponent
          unsavedChanges={unsavedChanges}
          onSave={saveChanges}
          onCancel={() => router.push("/masterData")}
        />
      </Box>
      {masterData?.masterDataType.dataFields.map((df) => (
        <DataFieldCard
          canEdit={canEdit}
          key={df.id}
          dataField={df}
          answer={masterDataAnswersState?.find((a) => a.dataFieldId === df.id)}
          onChange={(a) => handleAnswerChanged(df, a)}
        />
      ))}
      <CreatedByComponent
        canEdit={canEdit}
        user={currentUser}
        userChanged={currentUser?.id !== masterData?.createdBy.id}
        onChange={setCurrentUser}
        onSave={handleSaveUser}
        onCancel={() => setCurrentUser(masterData?.createdBy)}
      />
      {canDelete && (
        <Button onClick={() => setDeleteOpen(true)} color="error">
          <DeleteForever /> Datensatz Löschen
        </Button>
      )}
      <ConfirmDialog
        title={`Datensatz ${masterData?.masterDataTypeName} - ${masterDataNumber} Löschen?`}
        body={
          "Soll dieser Stammdatensatz endgültig gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden"
        }
        open={deleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}

