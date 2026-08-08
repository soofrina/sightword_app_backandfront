import React, { useState } from "react";
import PopUpModal from "@components/popup-model";
import { WordBankGridCard } from "@base/pages/word-bank-page";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import SwipeableViews from "react-swipeable-views";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import EditIcon from "@mui/icons-material/Edit";
import TextArea from "@base/components/text-area/textArea";
import WordBankAudioPlayer from "../word-bank-audio-player";
interface WordBankWordPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  words: WordBankGridCard[];
  onEditClick: (gridCards: WordBankGridCard[]) => void;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const WordBankWordPopUp = ({
  isOpen,
  onClose,
  words,
  onEditClick,
  activeStep,
  setActiveStep,
}: WordBankWordPopUpProps) => {
  const maxSteps = words.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep + 1 === maxSteps ? 0 : prevActiveStep + 1,
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1,
    );
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const getFileName = (path: string) => {
    const fileName = path.split("/").pop();
    return fileName ?? "";
  };

  return (
    <PopUpModal
      popUpTitle={words[0].word ?? ""}
      open={isOpen}
      onClose={onClose}
    >
      <EditIcon
        onClick={() => onEditClick(words)}
        className='text-primaryMain cursor-pointer absolute top-[23px] right-12 mr-5'
      />
      <div className='mt-5 w-full h-full flex flex-col gap-2 justify-start'>
        <SwipeableViews
          enableMouseEvents
          index={activeStep}
          onChangeIndex={handleStepChange}
        >
          {words.map((word, index) => (
            <div key={index}>
              <div className='grid grid-cols-2 gap-4'>
                <div className='mx-5 mt-2'>
                  <div className='w-full flex justify-center'>
                    <img
                      className='h-36 w-64 object-cover'
                      src={word.imagePath}
                    />
                  </div>
                  <div className='flex justify-center mt-2 text-sublineText'>
                    <p>{getFileName(word.imagePath)}</p>
                  </div>
                  <div className='flex justify-center mt-2 text-sublineText'>
                    <WordBankAudioPlayer audioPath={word.audioPath} />

                    <p>{getFileName(word.audioPath)}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <p className='font-semibold'>Difficulty</p>
                    <input
                      disabled
                      className='rounded py-2 px-4 border bg-white border-sublineText text-sublineText'
                      value={word.difficulty}
                    />
                  </div>
                  <div className='mt-2'>
                    <p className='font-semibold'>Sentence</p>
                    <TextArea
                      isDisabled={true}
                      value={word.sentence}
                      className='w-3/4 h-24 bg-white text-sublineText'
                    />
                  </div>
                  <div className='mt-2'>
                    <p className='font-semibold'>Comments</p>
                    <input
                      disabled
                      className='outline-none w-3/4 rounded py-1 px-4 bg-white text-sublineText'
                      placeholder='Nil'
                    />
                  </div>
                </div>
              </div>
              <br />
              <br />
              <br />
            </div>
          ))}
        </SwipeableViews>
        {maxSteps > 1 && (
          <MobileStepper
            steps={maxSteps}
            activeStep={activeStep}
            className='h-5 absolute bottom-2 bg-[#FAF9F6]'
            nextButton={
              <div>
                <KeyboardArrowRight
                  className='text-primaryMain rounded-full cursor-pointer absolute right-5 -top-[210px]'
                  onClick={handleNext}
                />
              </div>
            }
            backButton={
              <div>
                <KeyboardArrowLeft
                  className='text-primaryMain rounded-full cursor-pointer absolute left-5 -top-[210px]'
                  onClick={handleBack}
                />
              </div>
            }
          />
        )}
      </div>
    </PopUpModal>
  );
};

export default WordBankWordPopUp;
