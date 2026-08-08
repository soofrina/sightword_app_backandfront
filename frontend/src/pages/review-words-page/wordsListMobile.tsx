import { WordData } from "@base/type/reviewWords";
import WordListCard from "./wordListCard";
import { Pagination } from "@mui/material";

interface WordsListMobileProps {
  processedData: WordData[];
  numPages: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onClickLearn?: (wordId: string, lessonWordId: string) => void;
  onClickQuiz?: (wordId: string, lessonWordId: string) => void;
}

const WordsListMobile = ({
  processedData,
  numPages,
  handlePageChange,
  onClickLearn = () => undefined,
  onClickQuiz = () => undefined,
}: WordsListMobileProps) => {
  return (
    <div className='mb-96'>
      {processedData.map((word) => (
        <WordListCard
          key={word.id}
          id={word.id.toString()}
          wordFilter={word.wordFilter}
          difficulty={word.difficulty}
          sentence={word.sentence}
          imagePath={word.imagePath}
          lastReviewedFilter={word.lastReviewedFilter}
          audioPath={word.audioPath}
          onClickLearn={() => onClickLearn(word.id, word.lessonWordId ?? "")}
          onClickQuiz={() => onClickQuiz(word.id, word.lessonWordId ?? "")}
        />
      ))}
      <div className='flex justify-center'>
        <Pagination
          style={{ zIndex: 0 }}
          count={numPages}
          color='primary'
          onChange={handlePageChange}
          size='large'
        />
      </div>
    </div>
  );
};

export default WordsListMobile;
