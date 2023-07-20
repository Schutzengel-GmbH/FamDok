import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface SelectResponseDialogProps {
  responses: Prisma.ResponseGetPayload<{
    include: {
      answers: { include: { answerSelect: true } };
      user: true;
      family: { include: { caregivers: true; children: true } };
    };
  }>[];
  open: boolean;
  onClose: () => void;
}

export default function SelectResponseDialog({
  open,
  responses,
  onClose,
}: SelectResponseDialogProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResponses, setFilteredResponses] = useState<
    Prisma.ResponseGetPayload<{
      include: {
        answers: { include: { answerSelect: true } };
        user: true;
        family: { include: { caregivers: true; children: true } };
      };
    }>[]
  >(responses);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = responses.filter((r) =>
        getResponseNameString(r)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredResponses(filtered);
    } else {
      setFilteredResponses(responses);
    }
  }, [searchTerm, responses]);

  function getResponseNameString(
    response: Prisma.ResponseGetPayload<{
      include: {
        answers: { include: { answerSelect: true } };
        user: true;
        family: { include: { caregivers: true; children: true } };
      };
    }>
  ) {
    return `Antwort erstellt am: ${new Date(
      response.createdAt
    ).toLocaleString()} ${
      response.family ? `| Zu Familie: ${response.family.number} ` : ""
    }`;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Meine Antworten</DialogTitle>
      <DialogContent>
        <TextField
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Filter..."
        />
        <List>
          {filteredResponses.map((r) => (
            <ListItemButton
              key={r.id}
              onClick={() => router.push(`/surveys/${r.surveyId}/${r.id}`)}
            >
              <Typography>{getResponseNameString(r)}</Typography>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
