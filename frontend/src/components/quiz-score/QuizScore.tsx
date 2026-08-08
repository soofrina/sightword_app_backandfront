import { Typography } from "@material-ui/core";
import CircularScore from "./CircularScore";
import QuizScoreBackground from "@assets/QuizScoreBackground.svg"; // Import the background SVG file
import { useRecoilState } from "recoil";
import { scoreSelector } from "@recoil/journey";
import { useEffect } from "react";
import { createNewQuizAttempt, updateQuizAttempt } from "@base/api/lessons";

interface QuizScoreProps {
  onLoad?: () => void;
}

const QuizScore = ({ onLoad }: QuizScoreProps) => {
  useEffect(() => {
    onLoad && onLoad();
  }, []);

  const [scores, setScores] = useRecoilState(scoreSelector);
  useEffect(() => {
    scores.forEach(async (sc) => {
      if (sc.wordAttemptId) {
        createNewQuizAttempt(sc.wordAttemptId, sc.scoreOne, sc.scoreTwo)
          .then((res) => {
            if (res.status !== 200) {
              return;
            }
            return res.data;
          })
          .catch((err) => console.log(err));
      }
    });
  }, [scores]);

  const totalMarks = scores.length * 2;
  const getMarks = () => {
    let totalScore = 0;
    totalScore += scores
      .map((sc) => sc.scoreOne)
      .reduce((acc, cv) => acc + cv + 0);
    totalScore += scores
      .map((sc) => sc.scoreTwo)
      .reduce((acc, cv) => acc + cv + 0);
    return totalScore;
  };

  const percentage = (getMarks() / totalMarks) * 100;

  return (
    <div className='flex flex-col items-center justify-center'>
      <Typography variant='h6' className='mt-3 text-subHeader'>
        QUIZ RESULTS
      </Typography>
      <div className='relative w-[230px] h-[180px]'>
        <img
          src={QuizScoreBackground}
          alt='Background'
          className='absolute top-0 left-0 w-full h-full'
        />
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <CircularScore radius={60} strokeWidth={8} percentage={percentage} />
        </div>
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <Typography variant='h4' className='text-secondaryDark font-bold'>
            {getMarks()}/{totalMarks}
          </Typography>
        </div>
      </div>
      <Typography variant='h6' className='text-secondaryDark'>
        {percentage <= 50 ? "Good Try! Keep Practicing!" : "Well Done!"}
      </Typography>
      <Typography variant='body1'>
        You answered right on {getMarks()} / {totalMarks} questions
      </Typography>
    </div>
  );
};

export default QuizScore;
