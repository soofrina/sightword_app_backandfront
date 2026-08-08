import "./lessonJourney.css";
import { useLocation, useParams } from "react-router";
import RecapJourney from "./recapJourney";
import LessonJourney from "./lessonJourney";
import { scoreSelector } from "@recoil/journey";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

export interface LessonJourneyWord {
  id: string;
  word: string;
  sentence: string;
  images: string[];
  audios: string[];
  definition: string;
  difficulty: string;
}

// Controls entire lesson journey process.
const LessonJourneyV2 = () => {
  const { wordId, lessonWordId, lessonId } = useParams();
  const [scores, setScores] = useRecoilState(scoreSelector);
  const location = useLocation();
  const receivedState = location.state;

  useEffect(() => {
    // on load, reset scores
    setScores([]);
  }, []);

  if (wordId) {
    return (
      <RecapJourney
        wordId={wordId}
        lessonWordId={lessonWordId ?? ""}
        isQuiz={receivedState?.isQuiz}
      />
    );
  }

  if (lessonId) {
    return <LessonJourney lessonId={lessonId} />;
  }

  return null;
};

export default LessonJourneyV2;
