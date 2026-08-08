import { Box, ClickAwayListener, Tooltip } from "@mui/material";
import { WordData } from "@base/type/reviewWords";
import Table from "@base/components/Table";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { formatDate } from "@base/utility/common";
import WordBankGridView from "@base/components/word-bank/word-bank-grid-view/wordBankGridView";
import { WordBankGrid, WordBankGridCard } from "../word-bank-page";
import { useEffect, useState } from "react";
import { OptionData } from "@base/type/appSelect";
import VolumeUpOutlined from "@mui/icons-material/VolumeUpOutlined";
import GridCard from "@base/components/word-bank/word-bank-grid-view/word-bank-grid-card/gridCard";
import WordBankAudioPlayer from "@base/components/word-bank/word-bank-audio-player";

interface WordListDesktopProps {
  processedData: WordData[];
  isGridView: boolean;
  onClickLearn?: (id: string, lessonWordId: string) => void;
  onClickQuiz?: (id: string, lessonWordId: string) => void;
}

const WordsListDesktop = ({
  processedData,
  isGridView,
  onClickLearn,
  onClickQuiz,
}: WordListDesktopProps) => {
  // Pagination logic for grid view only
  const [cardsPerPage, setCardsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagedTableData, setPagedTableData] = useState<WordBankGrid[][]>([]);

  const [currentlyShownCardWord, setCurrentlyShownCardWord] = useState<
    WordBankGridCard | undefined
  >();
  const [currentlyShownCardWordRow, setCurrentlyShownCardWordRow] = useState<
    number | undefined
  >();
  const [gridCardPos, setGridCardPos] = useState<string>("0");

  useEffect(() => {
    const value = 300 + 52 * (currentlyShownCardWordRow ?? 1);
    setGridCardPos(`${value}px`);
  }, [currentlyShownCardWordRow]);

  const columns: GridColDef[] = [
    {
      field: "wordFilter",
      headerName: "Word",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div
            className='flex items-center cursor-pointer'
            onClick={() => {
              setCurrentlyShownCardWord({
                ...params.row,
                word: params.row.wordFilter,
              });
              setCurrentlyShownCardWordRow(params.row.rowNum);
            }}
          >
            <p>{params.row.wordFilter}</p>
            <WordBankAudioPlayer
              audioPath={params.row.audioPath}
              className='ml-1 cursor-pointer text-[#ABABAB]'
            />
          </div>
        );
      },
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 150,
    },
    {
      field: "lastReviewedFilter",
      headerName: "Last Reviewed",
      width: 150,
    },
    {
      field: "sentence",
      headerName: "Sentence",
      minWidth: 280,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Tooltip title={params.row.sentence}>
            <p>{params.row.sentence}</p>
          </Tooltip>
        );
      },
    },
    {
      field: "learn",
      headerName: "",
      renderCell: (params: GridRenderCellParams) => (
        <p
          className='hover:cursor-pointer underline text-primaryMain dark:text-primaryMain-d'
          onClick={() => {
            onClickLearn &&
              onClickLearn(params.row.id, params.row.lessonWordId);
          }}
        >
          Learn
        </p>
      ),
      width: 100,
      sortable: false,
    },
    {
      field: "quiz",
      headerName: "",
      renderCell: (params: GridRenderCellParams) => (
        <p
          className='hover:cursor-pointer underline text-primaryMain dark:text-primaryMain-d'
          onClick={() => {
            onClickQuiz && onClickQuiz(params.row.id, params.row.lessonWordId);
          }}
        >
          Quiz
        </p>
      ),
      width: 100,
      sortable: false,
    },
  ];
  const rows = processedData.map((word, idx) => {
    return {
      id: word.id.toString(),
      lessonWordId: word.lessonWordId,
      wordFilter: word.wordFilter,
      difficulty: word.difficulty.toString(),
      sentence: word.sentence,
      lastReviewedFilter: word.lastReviewedFilter
        ? formatDate(word.lastReviewedFilter)
        : " --",
      imagePath: word.imagePath,
      audioPath: word.audioPath,
      rowNum: idx,
    };
  });

  // Process Grid Data - reduce to get all same word WordBankGridCard
  const gridData = processedData.reduce<Map<string, WordBankGridCard[]>>(
    (acc, curr) => {
      const gridCard: WordBankGridCard = {
        id: curr.id.toString(),
        word: curr.wordFilter,
        difficulty: curr.difficulty,
        sentence: curr.sentence,
        imagePath: curr.imagePath,
        audioPath: curr.audioPath,
      };
      if (!acc.has(gridCard.word)) {
        acc.set(gridCard.word, []);
      }
      acc.get(curr.wordFilter)?.push(gridCard);
      return acc;
    },
    new Map<string, WordBankGridCard[]>(),
  );

  const gridDataArray = Array.from(gridData).map((data, i) => ({
    id: i.toString(),
    card: data[1],
  }));

  const handleCardsPerPageChange = (data: OptionData) => {
    setCardsPerPage(data.value as number);

    const lastValidPage = Math.ceil(gridDataArray.length / data.value);
    const isCurrentPageValid = currentPage <= lastValidPage;
    if (isCurrentPageValid) {
      return;
    }
    setCurrentPage(lastValidPage);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const pagedData = gridDataArray.reduce<WordBankGrid[][]>((acc, curr, i) => {
      if (i % cardsPerPage === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(curr);
      return acc;
    }, []);
    setPagedTableData(pagedData);
  }, [cardsPerPage, processedData]);

  return (
    <div className='mb-96 w-[1000px]'>
      {!isGridView && (
        <Table columns={columns} rows={rows} className='w-full' />
      )}
      {isGridView && (
        <WordBankGridView
          data={pagedTableData[currentPage - 1]}
          handleCardsPerPageChange={handleCardsPerPageChange}
          cardsPerPage={cardsPerPage}
          totalCards={pagedTableData.length * cardsPerPage}
          onCardClick={() => undefined}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
      {currentlyShownCardWord && (
        <ClickAwayListener
          onClickAway={() => {
            setCurrentlyShownCardWord(undefined);
          }}
        >
          <Box style={{ position: "absolute", top: gridCardPos }}>
            <GridCard data={[currentlyShownCardWord]} />
          </Box>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default WordsListDesktop;
