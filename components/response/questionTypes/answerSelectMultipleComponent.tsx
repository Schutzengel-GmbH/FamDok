import useInputDialog from "@/components/inputDialog/inputDialogContext";
import { AnswerComponentProps } from "@/components/response/answerQuestion";
import { IAnswerSelectOtherValues } from "@/types/prismaHelperTypes";
import { RecursivePartial } from "@/types/utilTypes";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { SelectOption } from "@prisma/client";
import { useState } from "react";

export default function AnswerSelectMultipleComponent({
  question,
  answer,
  onChange,
}: AnswerComponentProps) {
  const { showInputDialog } = useInputDialog();

  const [otherValues, setOtherValues] = useState<IAnswerSelectOtherValues>(
    (answer?.answerSelectOtherValues as IAnswerSelectOtherValues) || []
  );

  function updateOtherValues(id: string, value: string) {
    const index = otherValues.findIndex((o) => o.selectOptionId === id);
    let newValues = [...otherValues];
    if (index > -1) {
      newValues[index] = { selectOptionId: id, value: value };
      setOtherValues(newValues);
    } else {
      newValues.push({ selectOptionId: id, value: value });
      setOtherValues(newValues);
    }
    return newValues;
  }

  function handleChange(
    e: any,
    options: RecursivePartial<SelectOption>[],
    reason: string,
    details?: any
  ) {
    if (reason === "selectOption" && details.option.isOpen) {
      showInputDialog({
        title: details.option.value || "Misc",
        initialValue: "",
        onConfirm: function (value: string) {
          const otherValues = updateOtherValues(details.option.id, value);
          onChange({
            ...answer,
            answerSelect: options,
            answerSelectOtherValues: otherValues,
          });
        },
      });
    } else onChange({ ...answer, answerSelect: options });
  }

  function handleEdit(option: RecursivePartial<SelectOption>) {
    showInputDialog({
      title: "",
      initialValue:
        otherValues.find((o) => o.selectOptionId === option.id).value || "",
      onConfirm: function (value: string) {
        const otherValues = updateOtherValues(option.id, value);
        onChange({
          ...answer,
          answerSelectOtherValues: otherValues,
        });
      },
    });
  }

  function getOptionLabel(option: RecursivePartial<SelectOption>) {
    const otherValue = otherValues.find((o) => o.selectOptionId === option.id);

    if (option.isOpen) return `${option.value}: ${otherValue?.value || "---"}`;

    return option.value;
  }

  function isOptionEqualToValue(
    option: RecursivePartial<SelectOption>,
    value: RecursivePartial<SelectOption>
  ) {
    return option.value === value.value;
  }

  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={2}
      options={question.selectOptions}
      getOptionLabel={getOptionLabel}
      value={answer?.answerSelect}
      onChange={handleChange}
      renderTags={(values, getTagProps) =>
        values.map((v, i) => {
          const { className, disabled, key, onDelete, tabIndex } = getTagProps({
            index: i,
          });
          return (
            <Chip
              clickable
              onClick={() => handleEdit(v)}
              key={key}
              className={className}
              disabled={disabled}
              label={getOptionLabel(v)}
              onDelete={(e) => onDelete(e)}
              tabIndex={tabIndex}
            />
          );
        })
      }
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextField {...params} placeholder={question.questionText} />
      )}
    />
  );
}
