import { Class } from "@type/dataTypes";
import ClassCard from "@components/class-cards/classCard";
import { Grid } from "@mui/material";

type ClassCardHandleClickFunction = (id: string) => void;
export interface ClassCardsProps {
  handleClickCard?: ClassCardHandleClickFunction;
  selectedClass?: string;
  classes: Class[];
  selectClass?: (id: string) => void;
  unselectClass?: () => void;
}

const ClassCards = ({
  handleClickCard = () => undefined,
  selectedClass = "",
  classes,
  selectClass = () => undefined,
  unselectClass = () => undefined,
}: ClassCardsProps) => {
  return (
    <div className='w-full p-6'>
      <Grid className='ml-1 mt-1 w-fit' container spacing={"24px"}>
        {classes.map((c, index) => {
          return (
            <Grid item key={`class-card-grid-item-${index}`}>
              <ClassCard
                id={c.id}
                selected={c.id === selectedClass}
                selectClass={() => selectClass(c.id)}
                unselectClass={unselectClass}
                onClick={() => handleClickCard(c.id)}
                key={`class-card-${index}`}
                day={c.day}
                startTime={c.startTime}
                endTime={c.endTime}
                location={c.learningCentre}
                teachers={c.teachers}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ClassCards;
