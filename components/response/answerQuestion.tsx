import { FullQuestion, PartialAnswer } from "@/types/prismaHelperTypes";
import { QuestionType } from "@prisma/client";
import AnswerTextComponent from "./questionTypes/answerTextComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type AnswerQuestionProps = {
  question: FullQuestion;
  answer?: PartialAnswer;
  onChange: (answer: PartialAnswer) => void;
};

export default function AnswerQuestion({
  answer,
  question,
  onChange,
}: AnswerQuestionProps) {
  let questionComponent: JSX.Element;

  switch (question.type) {
    case QuestionType.Text:
      questionComponent = (
        <AnswerTextComponent
          question={question}
          answer={answer}
          onChange={onChange}
        />
      );
      break;
    default:
      questionComponent = (
        <Alert severity="error">{`Fragetyp ${question.type} nicht unterstützt`}</Alert>
      );
  }

  return (
    <Paper
      sx={{
        p: ".5rem",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      }}
      elevation={3}
    >
      <Typography variant="h6">{question.questionTitle}</Typography>
      {question.questionText && (
        <Typography>{question.questionText}</Typography>
      )}
      {question.questionDescription && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary">Beschreibung/Hinweise</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{question.questionDescription}</Typography>
          </AccordionDetails>
        </Accordion>
      )}
      {questionComponent}
    </Paper>
  );
}
