import { DifficultyLevel } from "@base/type/wordBank";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import WordChip from "./WordChip";

interface ClassWordsTableProps {
  rows: {
    lesson: string;
    words: { word: string; difficulty: DifficultyLevel }[];
  }[];
}

const ClassWordsTable = ({ rows }: ClassWordsTableProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const dashedBorderStyle = {
    borderBottom: "1px dashed black",
  };

  const cellStyle = {
    minWidth: isDesktop ? "300px" : "120px", // Different minWidth based on screen size
  };

  return (
    <div className='flex justify-center pt-2'>
      <TableContainer component={Paper} className='w-full'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='font-bold' style={cellStyle}>
                Lesson
              </TableCell>
              <TableCell className='font-bold' style={cellStyle}>
                Word(s)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    ...cellStyle,
                    ...(index < rows.length - 1 ? dashedBorderStyle : {}),
                  }}
                >
                  {row.lesson}
                </TableCell>
                <TableCell
                  style={{
                    ...cellStyle,
                    ...(index < rows.length - 1 ? dashedBorderStyle : {}),
                  }}
                >
                  <div className='space-x-2'>
                    {row.words.map((wordObj, i) => (
                      <WordChip
                        key={i}
                        word={wordObj.word}
                        difficulty={wordObj.difficulty}
                      />
                    ))}{" "}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClassWordsTable;
