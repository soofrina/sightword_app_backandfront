import RecoilTest from "@components/recoil-test/recoilTest";
import { dummyApiData } from "../word-bank-page/dummyData";
import AppSelect from "@base/components/app-select/AppSelect";
import { OptionData, RenderFnProps } from "@base/type/appSelect";
import { ChangeEvent, useEffect, useState } from "react";
import { SortOptions, SortOrder, WordData, Sort } from "@base/type/reviewWords";
import SortOption from "./sortOption";
import { DifficultyLevel, difficultyValues } from "@base/type/wordBank";
import SearchBar from "@base/components/search-bar";
import { DropdownVariant } from "@base/type/appDropdown";
import ClassSelectChip from "@base/components/class-select-chip";
import WordsListMobile from "./wordsListMobile";
import WordsListDesktop from "./wordsListDesktop";
import WindowIcon from "@mui/icons-material/Window";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import {
  getLessonsByStudentId,
  getLessonWordsByMultipleLessonIdAndStudentId,
} from "@base/api/lessons";
import { useRecoilValue } from "recoil";
import { userAtom } from "@recoil/user";
import { useQuery } from "@tanstack/react-query";
import { LessonData } from "@base/type/dataTypes";
import { useNavigate } from "react-router";
import { studentRoutes } from "@base/constants/routes";

interface SortSelectProps {
  sortOptions: SortOptions[];
  currentSort: number;
  handleSortChange: (optionData: OptionData) => void;
}

const SortSelect = ({
  sortOptions,
  currentSort,
  handleSortChange,
}: SortSelectProps) => {
  return (
    <AppSelect
      dropdownVariant={DropdownVariant.GHOST}
      className='text-xs'
      data={sortOptions.map((sortOption) => sortOption.optionData)}
      value={sortOptions[currentSort].optionData}
      onChange={handleSortChange}
    />
  );
};

interface FilterSelectProps {
  filterOptions: OptionData[];
  currentFilter: number;
  handleFilterChange: (optionData: OptionData) => void;
}

const FilterSelect = ({
  filterOptions,
  currentFilter,
  handleFilterChange,
}: FilterSelectProps) => {
  return (
    <AppSelect
      dropdownVariant={DropdownVariant.GHOST}
      className='text-xs'
      data={filterOptions}
      value={filterOptions[currentFilter]}
      onChange={handleFilterChange}
    />
  );
};

const ReviewWords = () => {
  const user = useRecoilValue(userAtom);
  const getStudentId = () => {
    const roleName = user.roleNames.find((e) => e.role === "student");
    if (roleName && roleName.role_id) {
      return roleName.role_id;
    }
    return "";
  };
  // Sorting is defined by current sort + sort direction. If sort direction is undefined, then sort does nothing.
  const [sortOptionOrder, setSortOptionOrder] = useState<
    SortOrder | undefined
  >();
  const [currentSort, setCurrentSort] = useState<number>(0);
  const [currentFilter, setCurrentFilter] = useState<number>(0);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState<WordData[]>([]);
  const [processedData, setProcessedData] = useState<WordData[]>([]);
  const [displayedData, setDisplayedData] = useState<WordData[]>([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [isGridView, setIsGridView] = useState<boolean>(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  // Fetch data:
  const { data: lessonsData } = useQuery({
    queryKey: ["getLessonsByStudentId"],
    queryFn: () => getLessonsByStudentId(getStudentId()),
  });

  const lessonIds = lessonsData
    ? lessonsData.data.map((lesson: LessonData) => lesson.id)
    : [];

  const { data: lessonWordsData } = useQuery({
    queryKey: ["getLessonWordsByMultipleLessonIdAndStudentId"],
    queryFn: () =>
      getLessonWordsByMultipleLessonIdAndStudentId(lessonIds, getStudentId()),
    enabled: !!lessonIds.length, // Only run if lessonIds is not empty
  });

  useEffect(() => {
    if (lessonWordsData) {
      // Convert lessonWordsData to the format you need for WordData
      const convertedData = lessonWordsData.data.map((lessonWord) => {
        const {
          word: { id, word, sentence, difficulty, audios, images },
          attempts, // You may use this to derive 'lastReviewedFilter' if needed
        } = lessonWord;

        // Filter attempts for the specific student and sort them by the 'attemptedAt' date
        const studentAttempts = attempts
          .filter((attempt) => attempt.student.id === getStudentId())
          .sort(
            (a, b) =>
              new Date(b.attemptedAt).getTime() -
              new Date(a.attemptedAt).getTime(),
          );

        // Get the most recent attempt date, or set to null if no attempts
        const lastAttemptedAt = studentAttempts.length
          ? new Date(studentAttempts[0].attemptedAt)
          : null;

        const customImage =
          studentAttempts.length > 0 &&
          studentAttempts[0].imageApprovalStatus.toLowerCase() === "approved"
            ? studentAttempts[0].personalisedImageLink
            : "";

        return {
          id: id,
          lessonWordId: lessonWord.id,
          wordFilter: word,
          difficulty: difficulty as DifficultyLevel,
          sentence,
          lastEditedFilter: lastAttemptedAt,
          lastReviewedFilter: lastAttemptedAt,
          imagePath: customImage ? customImage : images[0] || "",
          audioPath: audios[0] || "",
        };
      });

      // Update your states with the newly fetched and converted data
      setData(convertedData);
      setProcessedData(convertedData); // You might want to process it before setting it
      setDisplayedData(convertedData); // You might want to filter it before setting it
    }
  }, [lessonWordsData]);

  const isMobile = width < 1280;

  const WORDS_PER_PAGE = 10;

  const sortOptions: SortOptions[] = [
    {
      optionData: {
        value: Sort.NONE,
        name: Sort.NONE,
        id: 0,
      },
    },
    {
      optionData: {
        value: Sort.LAST_REVIEWED,
        name: Sort.LAST_REVIEWED,
        id: 1,
        renderFn: (props: RenderFnProps) => (
          <SortOption
            sortOrder={sortOptionOrder}
            isSelected={currentSort === 1}
            name={props.name}
          />
        ),
      },
    },
    {
      optionData: {
        value: Sort.ALPHABETICAL_ORDER,
        name: Sort.ALPHABETICAL_ORDER,
        id: 2,
        renderFn: (props: RenderFnProps) => (
          <SortOption
            sortOrder={sortOptionOrder}
            isSelected={currentSort === 2}
            name={props.name}
          />
        ),
      },
    },
    {
      optionData: {
        value: Sort.DIFFICULTY,
        name: Sort.DIFFICULTY,
        id: 3,
        renderFn: (props: RenderFnProps) => (
          <SortOption
            sortOrder={sortOptionOrder}
            isSelected={currentSort === 3}
            name={props.name}
          />
        ),
      },
    },
  ];

  const filterOptions: OptionData[] = Object.values(DifficultyLevel).map(
    (diff, idx) => {
      return {
        value: diff,
        id: idx,
        name: diff === DifficultyLevel.ShowAll ? "No Filter" : diff,
      };
    },
  );

  // const classOptions = [
  //   "All",
  //   "Monday 4-5pm",
  //   "Tuesday 4-5pm",
  //   "Wednesday 4-5pm",
  //   "Thursday 4-5pm",
  //   "Friday 4-5pm",
  //   "Saturday 4-5pm",
  //   "Sunday 4-5pm",
  // ];

  const sortData = (wordArr: WordData[]) => {
    let sortedData: WordData[] = [];
    const copy = [...wordArr];
    switch (sortOptions[currentSort].optionData.name) {
      case Sort.ALPHABETICAL_ORDER:
        sortedData = copy.sort((a, b) =>
          a.wordFilter.localeCompare(b.wordFilter),
        );
        break;
      case Sort.DIFFICULTY:
        sortedData = copy.sort(
          (a, b) =>
            difficultyValues[a.difficulty] - difficultyValues[b.difficulty],
        );
        break;
      case Sort.LAST_REVIEWED:
        sortedData = copy.sort((a, b) => {
          if (a.lastReviewedFilter === null && b.lastReviewedFilter === null)
            return 0;
          if (a.lastReviewedFilter === null) return 1;
          if (b.lastReviewedFilter === null) return -1;
          return (
            a.lastReviewedFilter.getTime() - b.lastReviewedFilter.getTime()
          );
        });
        break;
      default:
        sortedData = wordArr;
        break;
    }

    if (sortOptionOrder === SortOrder.DESCENDING) {
      const sortedCopy = [...sortedData];
      sortedData = sortedCopy.reverse();
    }

    return sortedData;
  };

  const filterData = (wordArr: WordData[]) => {
    let filteredData: WordData[] = [];
    const copy = [...wordArr];

    switch (filterOptions[currentFilter].name) {
      case DifficultyLevel.Basic:
        filteredData = copy.filter(
          (word) => word.difficulty === DifficultyLevel.Basic,
        );
        break;
      case DifficultyLevel.Intermediate:
        filteredData = copy.filter(
          (word) => word.difficulty === DifficultyLevel.Intermediate,
        );
        break;
      case DifficultyLevel.Advanced:
        filteredData = copy.filter(
          (word) => word.difficulty === DifficultyLevel.Advanced,
        );
        break;
      default:
        filteredData = wordArr;
        break;
    }

    return filteredData;
  };

  /**
   * Sets sort to the next state.
   * If undefined, change to ASCENDING
   * If ASCENDING, change to DESCENDING
   * If DESCENDING, change back to undefined
   */
  const handleSortChange = (optionData: OptionData) => {
    if (optionData.id === currentSort) {
      if (!sortOptionOrder) {
        setSortOptionOrder(SortOrder.ASCENDING);
      } else if (sortOptionOrder === SortOrder.ASCENDING) {
        setSortOptionOrder(SortOrder.DESCENDING);
      } else {
        setSortOptionOrder(undefined);
        setCurrentSort(0);
      }
    } else {
      // select a new sorting order
      setSortOptionOrder(SortOrder.ASCENDING);
      setCurrentSort(optionData.id as number);
    }
  };

  const handleFilterChange = (optionData: OptionData) => {
    // set the selected as the current filter
    setCurrentFilter(optionData.id as number);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  // Runs when the sort order or filter or page changes
  useEffect(() => {
    const filteredBySearchData = data.filter((word) =>
      word.wordFilter.toLowerCase().includes(searchValue.toLowerCase()),
    );
    const newFilteredData = filterData(filteredBySearchData);
    const newSortedData = sortData(newFilteredData);
    setProcessedData(newSortedData);
    if (isMobile) {
      setDisplayedData(getPaginatedData(newSortedData));
    } else {
      setDisplayedData(newSortedData);
    }

    setNumPages(Math.ceil(newSortedData.length / WORDS_PER_PAGE));
  }, [
    currentSort,
    sortOptionOrder,
    currentFilter,
    searchValue,
    currentPage,
    isMobile,
  ]);

  // Function to get part of array depending on currentPage
  const getPaginatedData = (data: WordData[]) => {
    const startIdx = (currentPage - 1) * WORDS_PER_PAGE;
    const endIdx = startIdx + WORDS_PER_PAGE;
    return data.slice(startIdx, endIdx);
  };

  const navigate = useNavigate();

  const navigateToLearn = (wordId: string, lessonWordId: string) => {
    navigate(
      `${studentRoutes.wordLearningJourney
        .replace(":wordId", wordId)
        .replace(":lessonWordId", lessonWordId)}`,
    );
  };

  const navigateToQuiz = (wordId: string, lessonWordId: string) => {
    navigate(
      `${studentRoutes.wordLearningJourney
        .replace(":wordId", wordId)
        .replace(":lessonWordId", lessonWordId)}`,
      { state: { isQuiz: true } },
    );
  };

  return (
    <div
      className={`flex flex-col ${
        isMobile ? "w-screen" : "w-full"
      } min-h-screen h-max bg-gradient-to-b from-[#F4A295] to-[#EFE8E7] dark:from-[#4A4546] dark:to-[#989292]`}
    >
      <div className='flex justify-center w-full mt-5'>
        <div className={isMobile ? "w-10/12" : ""}>
          <p className='text-xl font-bold'>MY WORD BANK</p>
          <div className='w-full flex overflow-x-auto my-2'>
            {/* {classOptions.map((opt, idx) => {
              return (
                <ClassSelectChip
                  selected={selectedClass === idx}
                  key={opt}
                  text={opt}
                  onClick={() => setSelectedClass(idx)}
                />
              );
            })} */}
          </div>
          <div className={`flex justify-between ${!isMobile && "w-[1000px]"}`}>
            <SearchBar
              placeholder='Search'
              onChange={handleSearchChange}
              className={`${
                isMobile ? "w-full " : "w-[500px]"
              } h-10 bg-primaryLight dark:bg-backgroundPaper-d`}
            />
            <div className='flex'>
              {!isMobile && (
                <SortSelect
                  sortOptions={sortOptions}
                  currentSort={currentSort}
                  handleSortChange={handleSortChange}
                />
              )}
              {!isMobile && (
                <FilterSelect
                  filterOptions={filterOptions}
                  currentFilter={currentFilter}
                  handleFilterChange={handleFilterChange}
                />
              )}
            </div>
          </div>
          <div className='flex flex-col mt-2 mb-5'>
            <div className='flex items-center'>
              <p className='mr-2'>{processedData.length} words</p>
              {!isMobile &&
                (isGridView ? (
                  <ViewListOutlinedIcon
                    onClick={() => setIsGridView(false)}
                    className='text-gray text-3xl mr-3 cursor-pointer'
                  />
                ) : (
                  <WindowIcon
                    onClick={() => setIsGridView(true)}
                    className='text-gray text-3xl mr-3 cursor-pointer mt-1'
                  />
                ))}
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center'>
                {isMobile && (
                  <SortSelect
                    sortOptions={sortOptions}
                    currentSort={currentSort}
                    handleSortChange={handleSortChange}
                  />
                )}
              </div>
              <div className='flex items-center'>
                {isMobile && (
                  <FilterSelect
                    filterOptions={filterOptions}
                    currentFilter={currentFilter}
                    handleFilterChange={handleFilterChange}
                  />
                )}
              </div>
            </div>
          </div>
          {isMobile && (
            <WordsListMobile
              processedData={displayedData}
              numPages={numPages}
              handlePageChange={handlePageChange}
              onClickLearn={navigateToLearn}
              onClickQuiz={navigateToQuiz}
            />
          )}
          {!isMobile && (
            <WordsListDesktop
              processedData={processedData}
              isGridView={isGridView}
              onClickLearn={navigateToLearn}
              onClickQuiz={navigateToQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewWords;
