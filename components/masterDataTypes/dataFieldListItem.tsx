import EditDataFieldDialog from "@/components/masterDataTypes/editDataFieldDialog";
import { FullDataField } from "@/types/prismaHelperTypes";
import { getDataFieldTypeName } from "@/utils/masterDataUtils";
import {
  Chair,
  Check,
  Clear,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface DataFieldListItemProps {
  dataField: FullDataField;
  onChange: () => void;
}

export default function DataFieldListItem({
  dataField,
  onChange,
}: DataFieldListItemProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const handleOpen = () => setOpen(!open);
  const handleOpenEdit = () => setOpenEdit(!openEdit);
  const handleDelete = () => {};

  return (
    <Box>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText>
          {dataField.text}
          {open ? "" : ` (${dataField.type})`}
        </ListItemText>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          <ListItem>
            <ListItemText>{`Datenfeldbezeichnung: ${dataField.text}`}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>{`Datenfeldtyp: ${getDataFieldTypeName(
              dataField.type
            )}`}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Typography>{"Eingabe erforderlich?"} </Typography>
                <Typography>
                  {dataField.required ? (
                    <Check color="success" />
                  ) : (
                    <Clear color="error" />
                  )}
                </Typography>
              </Box>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>{`Beschreibung: ${
              dataField.description || "- Keine Beschreibung -"
            }`}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>{`Datentyp: ${dataField.type}`}</ListItemText>
          </ListItem>
          <ListItem>
            <Button onClick={handleOpenEdit}>
              <Edit /> Bearbeiten
            </Button>
            <Button onClick={handleDelete}>
              <Delete /> Löschen
            </Button>
          </ListItem>
        </List>
      </Collapse>

      <EditDataFieldDialog
        open={openEdit}
        onClose={() => {
          onChange();
          setOpenEdit(false);
        }}
        dataField={dataField}
      />
    </Box>
  );
}

