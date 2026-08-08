import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import SwipeableViews from "react-swipeable-views";

interface ImageCarousalProps {
  activeStep: number;
  imagePaths: string[];
  handleNext: () => void;
  handleStepChange: (step: number) => void;
}

const ImageCarousal = ({
  imagePaths,
  activeStep,
  handleNext,
  handleStepChange,
}: ImageCarousalProps) => {
  const maxSteps = imagePaths.length;

  return (
    <>
      <SwipeableViews
        enableMouseEvents
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {imagePaths.map((imagePath, index) => (
          <div key={index} className='w-full h-36'>
            <img className='object-cover w-full h-full' src={imagePath} />
          </div>
        ))}
      </SwipeableViews>
      {maxSteps > 1 && (
        <MobileStepper
          steps={maxSteps}
          activeStep={activeStep}
          className='h-5 absolute top-[124px] bg-[#FFFFFF80]'
          nextButton={
            <div>
              <KeyboardArrowRight
                className='bg-[#0000004d] text-[#D9D9D9] rounded-full cursor-pointer absolute right-1 -top-[65px]'
                onClick={(e) => {
                  handleNext();
                  e.stopPropagation();
                }}
              />
            </div>
          }
          backButton={<div></div>}
        />
      )}
    </>
  );
};

export default ImageCarousal;
