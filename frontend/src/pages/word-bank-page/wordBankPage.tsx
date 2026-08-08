import { getAllWords, deleteWordById } from "@base/api/words";
import PageTitle from "@base/components/page-title";
import WordBankAddWordPopUp from "@base/components/word-bank/word-bank-add-word-popup/wordBankAddWordPopUp";
import WordBankGridView from "@base/components/word-bank/word-bank-grid-view/wordBankGridView";
import { OptionData } from "@base/type/appSelect";
import { DifficultyLevel } from "@base/type/wordBank";
import WordBankDeleteWordPopUp from "@components/word-bank/word-bank-delete-word-popup/wordBankDeleteWordPopUp";
import WordBankEditWordPopUp from "@components/word-bank/word-bank-edit-word-popup/wordBankEditWordPopUp";
import WordBankTableLastEditCell from "@components/word-bank/word-bank-table-cells/word-bank-table-lastEdit-cell/wordBankTableLastEditCell";
import WordBankTableWordCell from "@components/word-bank/word-bank-table-cells/word-bank-table-word-cell";
import WordBankTableHeader from "@components/word-bank/word-bank-table-header/wordBankTableHeader";
import WordBankWordPopUp from "@components/word-bank/word-bank-word-popup/wordBankWordPopUp";
import Table from "@components/Table";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export type WordBankRow = {
  id: string;
  word: () => JSX.Element;
  wordFilter: string;
  difficulty: DifficultyLevel;
  sentence: string;
  comment?: string;
  lastEdited: () => JSX.Element;
  lastEditedFilter: Date;
  imagePath: string;
  audioPath: string;
};

export type WordBankGridCard = {
  id: string;
  word: string;
  difficulty: DifficultyLevel;
  sentence: string;
  comment?: string;
  lastEdited?: Date | null;
  lastReviewed?: Date | null;
  imagePath: string;
  audioPath: string;
};

export type WordBankGrid = {
  id: string;
  card: WordBankGridCard[];
};

const columns: GridColDef[] = [
  {
    field: "word",
    headerName: "Word",
    minWidth: 150,
    sortComparator: (v1, v2) => {
      const word1 = v1().props.word;
      const word2 = v2().props.word;
      return word1.localeCompare(word2);
    },
    renderCell: (params) => params.value(),
  },
  { field: "difficulty", headerName: "Difficulty", minWidth: 150 },
  { field: "sentence", headerName: "Sentence", minWidth: 400 },
  {
    field: "lastEdited",
    headerName: "Last Edited",
    minWidth: 250,
    renderCell: (params) => params.value(),
  },
];

const WordBankPage = () => {
  const populateTableData = async () => {
    const data = await getAllWords();
    const transformedData = data.data.map((word) => ({
      id: word.id as string,
      wordFilter: word.word,
      difficulty: word.difficulty as DifficultyLevel,
      sentence: word.sentence,
      comment: word.comment,
      lastEditedFilter: new Date(),
      lastReviewedFilter: new Date(),
      imagePath: word.images[0],
      audioPath: word.audios[0],
    }));

    const tableData = transformedData.map((data) => ({
      ...data,
      word: () => (
        <WordBankTableWordCell
          word={data.wordFilter}
          audioPath={data.audioPath}
        />
      ),
      lastEdited: () => (
        <WordBankTableLastEditCell
          id={data.id}
          onDelete={onGridDeleteClick}
          onEdit={() => onEditById(data.id, tableData)}
          lastEdit={data.lastEditedFilter}
        />
      ),
    }));

    setOriginData(tableData);
    setTableData(tableData);
    setDifficultyFilterData(tableData);
  };

  useEffect(() => {
    populateTableData();
  }, []);

  const [originData, setOriginData] = useState<WordBankRow[]>([]);
  const [tableData, setTableData] = useState<WordBankRow[]>([]);
  const [difficultyFilterData, setDifficultyFilterData] = useState<
    WordBankRow[]
  >([]);
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [showAltControl, setShowAltControl] = useState<boolean>(false);
  const [deletionData, setDeletionData] = useState<WordBankRow[]>([]);
  const [isDeleteWordPopUpOpen, setIsDeleteWordPopUpOpen] =
    useState<boolean>(false);
  const [isAddWordPopUpOpen, setIsAddWordPopUpOpen] = useState<boolean>(false);
  const [isEditWordPopUpOpen, setIsEditWordPopUpOpen] =
    useState<boolean>(false);
  const [isWordPopUpOpen, setIsWordPopUpOpen] = useState<boolean>(false);
  const [gridCardInView, setGridCardInView] = useState<WordBankGridCard[]>();
  const [activeStep, setActiveStep] = useState<number>(0);

  const onTableSelectionChange = (s: GridSelectionModel) => {
    setShowAltControl(s.length > 0);
    const toDelete = tableData.filter((data) => s.includes(data.id));
    setDeletionData(toDelete);
  };

  const filter = (filterTerm: DifficultyLevel) => {
    const difficultyFilterTableData = originData.filter((row) => {
      if (filterTerm === DifficultyLevel.ShowAll) {
        return true;
      }
      return row.difficulty === filterTerm;
    });
    setDifficultyFilterData(difficultyFilterTableData);
    setTableData(difficultyFilterTableData);
  };

  const search = (searchTerm: string) => {
    const searchFilterTableData = difficultyFilterData.filter((row) =>
      row.wordFilter.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setTableData(searchFilterTableData);
  };

  // Process Grid Data
  const gridData = tableData.reduce<Map<string, WordBankGridCard[]>>(
    (acc, curr) => {
      const gridCard = {
        id: curr.id,
        word: curr.wordFilter,
        difficulty: curr.difficulty,
        sentence: curr.sentence,
        lastEdited: curr.lastEditedFilter,
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

  // Custom Pagination Logic
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cardsPerPage, setCardsPerPage] = useState<number>(12);
  const [pagedTableData, setPagedTableData] = useState<WordBankGrid[][]>([]);

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
  }, [cardsPerPage, tableData]);

  const handleGridViewChange = () => {
    setIsGridView((prev) => !prev);
    setCardsPerPage(12);
    handleGridSort({ id: 1, name: "A-Z", value: 1 });
  };

  const handleGridSort = (sortTerm: OptionData) => {
    const sortedData = [...tableData];
    sortedData.sort(
      (a, b) =>
        a.wordFilter.localeCompare(b.wordFilter) * (sortTerm.value as number),
    );
    setTableData(sortedData);
  };

  const onGridDeleteClick = (id: string) => {
    const toDelete = tableData.filter((data) => data.id === id);
    setDeletionData(toDelete);
    setIsDeleteWordPopUpOpen(true);
  };

  const onWordsDelete = async () => {
    const newTable = tableData.filter(
      (row) => !deletionData.map((d) => d.id).includes(row.id),
    );
    const promiseArr = deletionData.map((row) =>
      deleteWordById(row.id as unknown as string),
    );
    await Promise.all(promiseArr);
    setTableData(newTable);
  };

  const onWordDeletionCancel = (id: string) => {
    setDeletionData((prev) => prev.filter((data) => data.id !== id));
  };

  const onGridCardClick = (gridCards: WordBankGridCard[]) => {
    setGridCardInView(gridCards);
    setIsWordPopUpOpen(true);
    setActiveStep(0);
  };

  const onEditClick = (gridCards: WordBankGridCard[]) => {
    setGridCardInView(gridCards);
    setIsEditWordPopUpOpen(true);
    setIsWordPopUpOpen(false);
  };

  const onEditById = (id: string, data: WordBankRow[]) => {
    const toEdit = data.find((e) => e.id === id);

    if (!toEdit) return;
    const toEditCard = {
      ...toEdit,
      word: toEdit.wordFilter,
      difficulty: toEdit.difficulty,
      lastEdited: toEdit.lastEditedFilter,
    };
    onEditClick([toEditCard]);
  };

  return (
    <>
      {gridCardInView && (
        <WordBankWordPopUp
          isOpen={isWordPopUpOpen}
          onClose={() => {
            setIsWordPopUpOpen(false);
          }}
          words={gridCardInView}
          onEditClick={onEditClick}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      )}

      {gridCardInView && (
        <WordBankEditWordPopUp
          isOpen={isEditWordPopUpOpen}
          onClose={() => {
            setIsEditWordPopUpOpen(false);
            populateTableData();
          }}
          words={gridCardInView}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      )}

      <WordBankAddWordPopUp
        isOpen={isAddWordPopUpOpen}
        onClose={() => setIsAddWordPopUpOpen(false)}
        callback={populateTableData}
      />

      <WordBankDeleteWordPopUp
        isOpen={isDeleteWordPopUpOpen}
        deletionData={deletionData}
        onWordDeletionCancel={onWordDeletionCancel}
        onAllWordDelete={onWordsDelete}
        onClose={() => setIsDeleteWordPopUpOpen(false)}
      />
      <div className='flex flex-grow flex-col bg-backgroundDefault overflow-y-auto'>
        <div className='flex justify-between items-center mr-10'>
          <PageTitle title='Word Bank' />
        </div>
        <div className='bg-white rounded mx-12 mb-16 min-w-[1050px]'>
          <WordBankTableHeader
            searchFilterFunction={search}
            difficultyFilterFunction={filter}
            handleSetGridMode={handleGridViewChange}
            isShowGrid={isGridView}
            onGridSort={handleGridSort}
            showAltControl={showAltControl}
            onAddWord={() => setIsAddWordPopUpOpen(true)}
            onShowDeletePopup={() => setIsDeleteWordPopUpOpen(true)}
          />
          {!isGridView ? (
            <Table
              columns={columns}
              rows={tableData}
              showCheckBox={true}
              onSelectionChange={onTableSelectionChange}
            />
          ) : (
            <WordBankGridView
              handleCardsPerPageChange={handleCardsPerPageChange}
              cardsPerPage={cardsPerPage}
              data={pagedTableData[currentPage - 1]}
              totalCards={pagedTableData.length * cardsPerPage}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              onShowDeletePopup={onGridDeleteClick}
              onEditClick={onEditClick}
              onCardClick={onGridCardClick}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default WordBankPage;
