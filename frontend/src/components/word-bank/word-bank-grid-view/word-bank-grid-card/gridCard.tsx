import { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import SwipeableViews from "react-swipeable-views";

import ImageCarousal from "./imageCarousal";
import DifficultyChip from "./difficultyChip";
import { WordBankGridCard } from "@pages/word-bank-page";
import { formatDate } from "@base/utility/common";
import WordBankAudioPlayer from "../../word-bank-audio-player";

interface GridCardProps {
  onClick?: () => void;
  onEdit?: () => void;
  data: WordBankGridCard[];
  onDelete?: (id: string) => void;
  className?: string;
}

const GridCard = ({
  data,
  onDelete,
  onClick,
  onEdit,
  className,
}: GridCardProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const maxSteps = data.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep + 1 === maxSteps ? 0 : prevActiveStep + 1,
    );
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const imagePaths = data.map((item) => item.imagePath);

  return (
    <Card
      className={`mx-5 my-3 rounded-xl drop-shadow-none shadow-none cursor-pointer ${className} min-w-[200px] max-w-[250px]`}
      onClick={onClick}
      sx={{ maxWidth: 345, zIndex: 90 }}
    >
      <CardMedia className='h-36'>
        <ImageCarousal
          activeStep={activeStep}
          handleStepChange={handleStepChange}
          handleNext={handleNext}
          imagePaths={imagePaths}
        />
      </CardMedia>
      <SwipeableViews
        enableMouseEvents
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {data.map((card, index) => (
          <div key={index}>
            <CardContent className='p-3'>
              <div className='grid grid-cols-8 w-full'>
                <div className='col-span-6 flex'>
                  <Typography gutterBottom variant='h6' component='div'>
                    {card.word}
                  </Typography>
                  <WordBankAudioPlayer
                    audioPath={card.audioPath}
                    className='mt-1 ml-1 cursor-pointer text-[#ABABAB]'
                  />
                </div>
                <div className='col-span-1'>
                  {onEdit && (
                    <ModeEditIcon
                      onClick={(e) => {
                        onEdit();
                        e.stopPropagation();
                      }}
                      className='text-[#ABABAB] cursor-pointer'
                    />
                  )}
                </div>
                <div className='col-span-1'>
                  {onDelete && (
                    <RestoreFromTrashIcon
                      onClick={(e) => {
                        onDelete(card.id);
                        setActiveStep(0);

                        e.stopPropagation();
                      }}
                      className='text-[#ABABAB] cursor-pointer'
                    />
                  )}
                </div>
              </div>
              <DifficultyChip difficulty={card.difficulty} />
              <p className='text-[12px]'>{card.sentence}</p>
              {card.lastEdited && (
                <p className='text-[12px] italic text-[#ABABAB] mt-3'>
                  Last Edited: {formatDate(card.lastEdited)}
                </p>
              )}
              {card.lastReviewed && (
                <p className='text-[12px] italic text-[#ABABAB] mt-3'>
                  Last Reviewed: {formatDate(card.lastReviewed)}
                </p>
              )}
            </CardContent>
          </div>
        ))}
      </SwipeableViews>
    </Card>
  );
};

export default GridCard;
