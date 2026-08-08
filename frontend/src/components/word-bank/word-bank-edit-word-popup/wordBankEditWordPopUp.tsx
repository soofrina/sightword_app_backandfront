import React, { createRef, useEffect, useRef, useState } from "react";
import PopUpModal from "@components/popup-model";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import SwipeableViews from "react-swipeable-views";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import TextArea from "@components/text-area/textArea";
import AppButton from "@components/app-button/appButton";
import AppSelect from "@components/app-select/AppSelect";
import { DropdownVariant, DropdownColor } from "@base/type/appDropdown";
import { ButtonVariant } from "@base/type/appButton";
import { WordBankGridCard } from "@pages/word-bank-page";
import { DifficultyLevel } from "@base/type/wordBank";
import { updateWord } from "@base/api/words";

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
  words: WordBankGridCard[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const WordBankEditWordPopup = ({
  isOpen,
  onClose,
  words,
  activeStep,
  setActiveStep,
}: WordBankEditWordPopUpProps) => {
  useEffect(() => {
    const initFormData = words.map((item) => ({
      id: item.id as unknown as string,
      word: item.word,
      sentence: item.sentence,
      comment: item.comment ?? "",
      imagePath: item.imagePath,
      audioPath: item.audioPath,
      difficulty: item.difficulty,
    }));
    setFormData(initFormData);
  }, [words]);

  const [formData, setFormData] = useState<
    {
      id: string;
      word: string;
      sentence: string;
      comment?: string;
      imagePath: string;
      audioPath: string;
      difficulty: DifficultyLevel;
    }[]
  >();
  const [imageFileNames, setImageFileNames] = useState<string[]>(
    new Array(words.length).fill(""),
  );
  const [audioFileNames, setAudioFileNames] = useState<string[]>(
    new Array(words.length).fill(""),
  );

  const [imageURLs, setImageURLs] = useState<string[]>(
    new Array(words.length).fill(""),
  );

  const [audioURLs, setAudioURLs] = useState<string[]>(
    new Array(words.length).fill(""),
  );

  // Initialize your refs array, matching the length of `words`.
  const imageInputRefs = useRef<HTMLInputElement[]>([]);
  imageInputRefs.current = words.map(
    (_ref, index) => imageInputRefs.current[index] ?? createRef(),
  );

  const audioInputRefs = useRef<HTMLInputElement[]>([]);
  audioInputRefs.current = words.map(
    (_ref, index) => audioInputRefs.current[index] ?? createRef(),
  );

  const audioOutputRefs = useRef<HTMLAudioElement[]>([]);
  audioOutputRefs.current = words.map(
    (_, index) =>
      audioOutputRefs.current[index] ?? React.createRef<HTMLAudioElement>(),
  );

  const playAudio = (index: number) => {
    const audioElement = audioOutputRefs.current[index];
    if (audioElement) {
      audioElement.play();
    }
  };

  // clean up unused image and audio urls
  useEffect(() => {
    return () => {
      imageURLs.forEach((url) => URL.revokeObjectURL(url));
      audioURLs.forEach((url) => URL.revokeObjectURL(url));
      resetAudioAndImage();
    };
  }, []);

  const maxSteps = words.length;

  const resetAudioAndImage = () => {
    setImageFileNames(new Array(words.length).fill(""));
    setAudioFileNames(new Array(words.length).fill(""));
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

  const getFileName = (path: string) => {
    const fileName = path.split("/").pop();
    return fileName ?? "";
  };

  const onUpdateWords = async () => {
    const newWords = formData?.map((word, index) => {
      return updateWord(
        word.id,
        word.sentence,
        word.difficulty,
        word.comment ?? "",
        imageInputRefs.current[index]?.files?.[0],
        audioInputRefs.current[index]?.files?.[0],
      );
    });

    if (!newWords) return;

    try {
      await Promise.all(newWords);
    } catch (err) {
      console.log(err);
    } finally {
      resetAudioAndImage();
      imageURLs.forEach((url) => URL.revokeObjectURL(url));
      audioURLs.forEach((url) => URL.revokeObjectURL(url));
      onClose();
    }
  };

  return (
    <PopUpModal
      popUpTitle={`Edit Word - ${words[0].word ?? ""}`}
      open={isOpen}
      onClose={onClose}
    >
      <SwipeableViews
        enableMouseEvents
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {formData?.map((word, index) => (
          <div key={word.id}>
            <div className='grid grid-cols-2 gap-4'>
              <div className='mx-5 mt-2'>
                <div className='w-full flex justify-center'>
                  <img
                    className='h-36 w-64 object-cover'
                    src={imageURLs[index] || word.imagePath}
                  />
                </div>
                <div className='flex justify-center mt-2 text-sublineText'>
                  <p>{imageFileNames[index] || getFileName(word.imagePath)}</p>
                </div>
                <div className='flex justify-center mt-2'>
                  <AppButton variant={ButtonVariant.OUTLINED}>
                    Replace Image
                    <input
                      hidden
                      accept='image/png, image/gif, image/jpeg, image/jpg'
                      ref={(el: HTMLInputElement | null) => {
                        if (el) {
                          imageInputRefs.current[index] = el;
                        }
                      }}
                      type='file'
                      onChange={() => {
                        if (imageInputRefs.current[index]) {
                          const newImageFileNames = [...imageFileNames];
                          newImageFileNames[index] =
                            imageInputRefs.current[index]?.files?.[0]?.name ||
                            "";
                          setImageFileNames(newImageFileNames);
                        }
                        const file = imageInputRefs.current[index].files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          const newImageURLs = [...imageURLs];
                          newImageURLs[index] = url;
                          setImageURLs(newImageURLs);
                        }
                      }}
                      // hidden
                    />
                  </AppButton>
                </div>
                <div className='flex justify-center mt-2 text-sublineText'>
                  <button onClick={() => playAudio(index)}>
                    <VolumeUpOutlinedIcon className='text-primaryMain mr-1' />
                  </button>
                  <audio
                    ref={(el: HTMLAudioElement | null) => {
                      if (el) {
                        audioOutputRefs.current[index] = el;
                      }
                    }}
                    id={`audio-element-${index}`}
                    src={audioURLs[index] || word.audioPath}
                  ></audio>

                  <p>{audioFileNames[index] || getFileName(word.audioPath)}</p>
                </div>
                <div className='flex justify-center mt-2'>
                  <AppButton variant={ButtonVariant.OUTLINED}>
                    Replace Audio
                    <input
                      accept='audio/wav, audio/wav, audio/mpeg'
                      ref={(el: HTMLInputElement | null) => {
                        if (el) {
                          audioInputRefs.current[index] = el;
                        }
                      }}
                      type='file'
                      onChange={() => {
                        if (audioInputRefs.current[index]) {
                          const newAudioFileNames = [...audioFileNames];
                          newAudioFileNames[index] =
                            audioInputRefs.current[index]?.files?.[0]?.name ||
                            "";
                          setAudioFileNames(newAudioFileNames);
                        }
                        const file = audioInputRefs.current[index].files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          const newAudioURLs = [...audioURLs];
                          newAudioURLs[index] = url;
                          setAudioURLs(newAudioURLs);
                        }
                      }}
                      hidden
                    />
                  </AppButton>
                </div>
              </div>
              <div>
                <div className='mt-2'>
                  <p className='font-semibold'>Sentence</p>
                  <TextArea
                    value={word.sentence}
                    onChange={(e) => {
                      const sentence = e.target.value;
                      const clone = structuredClone(formData);
                      clone[index].sentence = sentence;
                      setFormData(clone);
                    }}
                    className='w-3/4 h-24 bg-white text-sublineText'
                  />
                </div>
                <div>
                  <p className='font-semibold'>Difficulty</p>
                  <AppSelect
                    className='w-3/4'
                    value={
                      difficultyLevels.find(
                        (level) => word.difficulty === level.value,
                      ) ?? difficultyLevels[0]
                    }
                    onChange={(data) => {
                      const val = data.value;
                      const clone = structuredClone(formData);
                      clone[index].difficulty = val;
                      setFormData(clone);
                    }}
                    data={difficultyLevels}
                    dropdownVariant={DropdownVariant.GHOST}
                    dropdownColor={DropdownColor.SECONDARY}
                  />
                </div>
                <div className='mt-2'>
                  <p className='font-semibold'>Comments</p>
                  <input
                    value={word.comment}
                    onChange={(e) => {
                      const val = e.target.value;
                      const clone = structuredClone(formData);
                      clone[index].comment = val;
                      setFormData(clone);
                    }}
                    className='outline-none w-3/4 rounded py-1 px-4 bg-white text-sublineText'
                    placeholder='Nil'
                  />
                </div>
              </div>
            </div>
            <div className='mt-10 flex flex-row gap-4 justify-end'>
              <AppButton
                className='rounded border-opacity-100 text-[#ABABAB] border-[#ABABAB]'
                variant={ButtonVariant.OUTLINED}
                onClick={onClose}
              >
                Cancel
              </AppButton>
              <AppButton
                className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]'
                variant={ButtonVariant.SOLID}
                onClick={onUpdateWords}
              >
                Update
              </AppButton>
            </div>
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
    </PopUpModal>
  );
};

export default WordBankEditWordPopup;
