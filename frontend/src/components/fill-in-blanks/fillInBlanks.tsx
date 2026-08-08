import React, { useState, useMemo, useEffect } from "react";
import { TextField, Grid } from "@material-ui/core";
import AppButton from "../app-button";
import { useRecoilState } from "recoil";
import { toastCorrect, toastWrong } from "@base/utility/toast";
import JourneyAudio from "../journey-audio/JourneyAudio";
import { disableRightButtonSelector } from "@recoil/journey";
import { ButtonVariant } from "@base/type/appButton";

interface FillInBlanksProps {
  audio?: string | undefined;
  word: string;
  isPastStage?: boolean;
  onLoad?: () => void;
}

const FillInBlanks = ({
  audio,
  word,
  isPastStage = false,
  onLoad,
}: FillInBlanksProps) => {
  const wordArray = useMemo(() => word.split(""), [word]);
  // if word is longer than 6 characters, there will be 2 blanks
  const isMultiBlank = useMemo(() => word.length >= 6, [word]);
  const [inputValues, setInputValues] = useState(["", ""]);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  useEffect(() => {
    onLoad && onLoad();
  }, []);

  useEffect(() => {
    if (isPastStage) {
      setIsRightButtonDisabled(false);
    } else {
      setIsRightButtonDisabled(true);
    }
  }, [isPastStage]);

  const [index1, index2] = useMemo(() => {
    const indices = new Set<number>();
    while (indices.size < (isMultiBlank ? 2 : 1)) {
      indices.add(Math.floor(Math.random() * word.length));
    }
    const indexArray = Array.from(indices);
    return indexArray.length === 2
      ? indexArray
      : [indexArray[0], indexArray[0]];
  }, [word, isMultiBlank]);

  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValues = [...inputValues];
      newValues[index] = event.target.value;
      setInputValues(newValues);
    };

  const isCorrect = () => {
    const wordArrayCopy = [...wordArray];
    wordArrayCopy[index1] = inputValues[0];
    if (isMultiBlank) {
      wordArrayCopy[index2] = inputValues[1];
    }

    return (
      wordArray.join("").toLowerCase() === wordArrayCopy.join("").toLowerCase()
    );
  };

  const handleVerify = () => {
    const isWordCorrect = isCorrect();
    if (isWordCorrect) {
      toastCorrect();
      setIsRightButtonDisabled(false);
    } else {
      toastWrong();
    }
  };

  return (
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <p className='text-subHeader font-bold'>Complete the word.</p>
      <div className='absolute end-1 top-2 flex flex-col items-center justify-center'>
        {audio && <p className='text-center'>Hear how it sounds</p>}
        {audio && <JourneyAudio audio={audio} />}
      </div>
      <div className='flex h-4/5'>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={1}
          className='w-screen'
        >
          {wordArray.map((letter, index) =>
            index === index1 || (isMultiBlank && index === index2) ? (
              <Grid key={index} item>
                <TextField
                  key={index}
                  variant='outlined'
                  value={inputValues[index === index1 ? 0 : 1]}
                  onChange={handleChange(index === index1 ? 0 : 1)}
                  className='w-14 text-center'
                  inputProps={{
                    style: {
                      fontSize: "3rem",
                      textAlign: "center",
                      padding: "0",
                      fontWeight: "bold",
                      color: "#414042",
                    },
                    maxLength: 1,
                  }}
                />
              </Grid>
            ) : (
              <Grid item key={index} className='text-5xl font-bold'>
                {letter}
              </Grid>
            ),
          )}
        </Grid>
      </div>
      <div className='absolute bottom-24 right-2'>
        {isRightButtonDisabled && (
          <AppButton
            onClick={handleVerify}
            variant={ButtonVariant.SOLID}
            className='w-32'
          >
            Verify
          </AppButton>
        )}
      </div>
    </div>
  );
};

export default FillInBlanks;
