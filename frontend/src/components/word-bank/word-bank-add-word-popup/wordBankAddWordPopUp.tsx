import React, { useState, useRef } from "react";
import PopUpModal from "@components/popup-model";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import SwipeableViews from "react-swipeable-views";
import TextArea from "@components/text-area/textArea";
import AppButton from "@components/app-button/appButton";
import AppSelect from "@components/app-select/AppSelect";
import { DropdownVariant, DropdownColor } from "@base/type/appDropdown";
import { ButtonVariant } from "@base/type/appButton";
import OverFlowText from "@base/components/overflow-text";
import { createWord } from "@base/api/words";
// TODO needed later for add homoymn logic
// import { WordBankGridCard } from "@pages/word-bank-page";
import { DifficultyLevel } from "@base/type/wordBank";
import { OptionData } from "@base/type/appSelect";

const difficultyLevels = [
  { id: 1, name: DifficultyLevel.Basic, value: DifficultyLevel.Basic },
  {
    id: 2,
    name: DifficultyLevel.Intermediate,
    value: DifficultyLevel.Intermediate,
  },
  { id: 3, name: DifficultyLevel.Advanced, value: DifficultyLevel.Advanced },
];

interface WordBankEditWordPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  callback?: () => void;
}

const WordBankEditWordPopup = ({
  isOpen,
  onClose,
  callback,
}: WordBankEditWordPopUpProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [userinWord, setUserinWord] = useState<string>("");
  const [userinSentence, setUserinSentence] = useState<string>("");
  const [userinComments, setUserinComments] = useState<string>("");
  const [userinDifficulty, setUserinDifficulty] = useState<OptionData>(
    difficultyLevels[0],
  );
  const [imageFileName, setImageFileName] = useState<string>("");
  const [audioFileName, setAudioFileName] = useState<string>("");
  const [activeStep, setActiveStep] = useState<number>(0);
  const maxSteps = [].length;

  const createWordHandler = async () => {
    const word = {
      id: "",
      word: userinWord,
      sentence: userinSentence,
      comment: userinComments,
      definition: userinSentence,
      difficulty: userinDifficulty.value as DifficultyLevel,
      images: [""],
      audios: [""],
    };
    try {
      const resp = await createWord(
        word,
        imageInputRef.current?.files?.[0],
        audioInputRef.current?.files?.[0],
      );
      if (resp) {
        setUserinWord("");
        setUserinSentence("");
        setUserinComments("");
        setUserinDifficulty(difficultyLevels[0]);
        setImageFileName("");
        setAudioFileName("");
        onClose();
        callback && callback();
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <PopUpModal popUpTitle='Add Word' open={isOpen} onClose={onClose}>
      {/* <AppButton
        className='absolute top-10 left-56'
        variant={ButtonVariant.GHOST}
      >
        Add Homonym
      </AppButton> */}
      <SwipeableViews
        enableMouseEvents
        index={activeStep}
        onChangeIndex={handleStepChange}
        className='w-full'
      >
        <div className='w-full'>
          <div className='grid grid-cols-2 gap-4 w-full'>
            <div className='mt-2 w-full'>
              <div className='mt-2'>
                <p className='font-semibold'>Word</p>
                <input
                  value={userinWord}
                  onChange={(e) => setUserinWord(e.target.value)}
                  className='outline-none w-3/4 rounded py-2 px-4 bg-white text-sublineText'
                />
              </div>
              <div className='mt-2'>
                <p className='font-semibold'>Add Picture</p>
                <AppButton variant={ButtonVariant.OUTLINED}>
                  Browse Files
                  <input
                    accept='image/png, image/gif, image/jpeg, image/jpg'
                    ref={imageInputRef}
                    type='file'
                    onChange={() => {
                      setImageFileName(
                        imageInputRef.current?.files?.[0].name || "",
                      );
                    }}
                    hidden
                  />
                </AppButton>
                <OverFlowText className='w-4/5'>{imageFileName}</OverFlowText>
              </div>
              <div className='mt-2'>
                <p className='font-semibold'>Add Audio</p>
                <AppButton variant={ButtonVariant.OUTLINED}>
                  Browse Files
                  <input
                    accept='audio/wav, audio/wav, audio/mpeg'
                    ref={audioInputRef}
                    type='file'
                    onChange={() => {
                      setAudioFileName(
                        audioInputRef.current?.files?.[0].name || "",
                      );
                    }}
                    hidden
                  />
                </AppButton>
                <OverFlowText className='w-4/5'>{audioFileName}</OverFlowText>
              </div>
            </div>
            <div>
              <div>
                <p className='font-semibold'>Difficulty</p>
                <AppSelect
                  className='w-2/4'
                  value={userinDifficulty}
                  onChange={(data) => {
                    setUserinDifficulty(data);
                  }}
                  data={difficultyLevels}
                  dropdownVariant={DropdownVariant.GHOST}
                  dropdownColor={DropdownColor.SECONDARY}
                />
              </div>
              <div className='mt-2'>
                <p className='font-semibold'>Sentence</p>
                <TextArea
                  value={userinSentence}
                  onChange={(e) => setUserinSentence(e.target.value)}
                  className='w-3/4 h-24 bg-white text-sublineText'
                />
              </div>
              <div className='mt-2'>
                <p className='font-semibold'>Comments (optional)</p>
                <input
                  value={userinComments}
                  onChange={(e) => setUserinComments(e.target.value)}
                  className='outline-none w-3/4 rounded py-1 px-4 bg-white text-sublineText'
                />
              </div>
            </div>
          </div>
          <div className='mt-10 flex flex-row gap-4 justify-end'>
            <AppButton
              className='rounded border-opacity-100 text-sublineText border-sublineText'
              variant={ButtonVariant.OUTLINED}
              onClick={onClose}
            >
              Cancel
            </AppButton>
            <AppButton
              className='rounded border-opacity-100 text-white'
              variant={ButtonVariant.SOLID}
              onClick={createWordHandler}
            >
              Add
            </AppButton>
          </div>
        </div>
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
    </PopUpModal>
  );
};

export default WordBankEditWordPopup;
