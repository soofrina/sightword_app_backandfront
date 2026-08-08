import { Chip } from "@mui/material";

interface WordItemProps {
  isAddMode?: boolean;
  onClickIcon?: () => void;
  word: string;
  icon: string;
}

/**
 * Reusable chip, icon parameter can be used to dynamically load icon. Possible use-cases: "add", "remove", "close".
 *
 */
const WordItem = ({
  isAddMode,
  icon,
  word,
  onClickIcon = () => console.log("Clicked icon"),
}: WordItemProps) => {
  return (
    <Chip
      sx={{
        color: `${
          isAddMode ? "customText.subHeader" : "customText.selectedButton"
        }`,
        borderColor: `${
          isAddMode ? "customText.subHeader" : "secondary.light"
        }`,
      }}
      className={"h-9 w-fit m-2 font-bold"}
      variant='outlined'
      label={word}
      onClick={() => console.info("Handle onClick")}
      onDelete={onClickIcon}
      deleteIcon={
        <span
          className={`material-icons mr-3 ml-1 ${
            isAddMode ? "text-subHeaderText" : "text-selected"
          }`}
        >
          {icon}
        </span>
      }
    />
  );
};

export default WordItem;
