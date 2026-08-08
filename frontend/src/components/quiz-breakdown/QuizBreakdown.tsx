import { Box, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { getLessonWordsByLessonId } from "@base/api/lessons";
import { LessonWordData } from "@base/type/dataTypes";
import { useRecoilState } from "recoil";
import { scoreSelector } from "@recoil/journey/selector";

export type QuizWord = {
  word: string;
  isTypePass: boolean;
  isFillPass: boolean;
};

interface QuizBreakdownProps {
  lessonId?: string;
  word?: string;
  onLoad?: () => void;
}

const QuizBreakdown = ({ word = "", lessonId, onLoad }: QuizBreakdownProps) => {
  useEffect(() => {
    onLoad && onLoad();
  }, []);

  const [scores, setScores] = useRecoilState(scoreSelector);

  const isPass = (score: number | null, total: number | null) => {
    if (!score || !total) {
      return false;
    }

    return score > total / 2;
  };

  const [quizScores, setQuizScores] = useState<QuizWord[]>([]);
  useEffect(() => {
    if (!lessonId) {
      setQuizScores([
        {
          word,
          isTypePass: scores[0].scoreOne === 1,
          isFillPass: scores[0].scoreTwo === 1,
        },
      ]);
      return;
    }

    getLessonWordsByLessonId(lessonId).then((res) => {
      if (!res) {
        return;
      }
      const lws = res.data;
      const quizWords = lws
        .filter((lw) => lw.attempts.length > 0 && lw.attempts[0].quizAttempt)
        .map((lw) => {
          const quizAttempt = lw.attempts[0].quizAttempt;

          return {
            word: lw.word.word,
            isTypePass: isPass(quizAttempt.scoreOne, quizAttempt.scoreOneTotal),
            isFillPass: isPass(quizAttempt.scoreTwo, quizAttempt.scoreTwoTotal),
          };
        });
      setQuizScores(quizWords);
      if (lws.length === 0) {
        return;
      }
    });
  }, [lessonId]);

  const mark = quizScores.reduce(
    (acc, word) => acc + (word.isTypePass ? 1 : 0) + (word.isFillPass ? 1 : 0),
    0,
  );

  const totalMark = quizScores.length * 2;
  const percentage = (mark / totalMark) * 100;

  const passed = percentage >= 50;
  const scoreColor = passed ? "#01BF5B33" : "#F4CF8733";
  const textColor = passed ? "#01BF5B" : "#F4C82A";

  const renderIcon = (isPass: boolean) =>
    isPass ? (
      <DoneIcon sx={{ ml: 1, color: "#01BF5B" }} />
    ) : (
      <CloseIcon sx={{ ml: 1, color: "#FF6D56" }} />
    );

  const getTextColor = (isPass: boolean) => (isPass ? "#01BF5B" : "#FF6D56");

  return (
    <Box className='flex flex-col items-center justify-center'>
      <Typography variant='h6' className='mt-3 text-subHeader'>
        QUIZ RESULTS
      </Typography>
      <Box
        bgcolor={scoreColor}
        py={1}
        px={4}
        my={1}
        display='flex'
        alignItems='center'
        justifyContent='center'
        className='rounded'
      >
        <Typography variant='h4' color={textColor} className='font-bold'>
          Your Score: {mark}/{totalMark}
        </Typography>
      </Box>
      {quizScores.map((word, index) => (
        <Box key={index} mt={2} display='flex' justifyContent='space-between'>
          <Typography variant='h6' mr={2} minWidth={200}>
            Word {index + 1}: {word.word}:
          </Typography>
          <Box alignItems='space-between'>
            <Box display='flex' alignItems='center' mb={1}>
              <Typography
                variant='subtitle1'
                color={getTextColor(word.isTypePass)}
                minWidth={105}
              >
                Type the word
              </Typography>
              {renderIcon(word.isTypePass)}
            </Box>
            <Box display='flex' alignItems='center'>
              <Typography
                variant='subtitle1'
                color={getTextColor(word.isFillPass)}
                minWidth={105}
              >
                Fill in the gaps
              </Typography>
              {renderIcon(word.isFillPass)}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default QuizBreakdown;
