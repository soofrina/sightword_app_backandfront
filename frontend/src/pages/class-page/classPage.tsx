import ClassCards from "@components/class-cards";
import PageTitle from "@components/page-title";
import { useEffect, useState } from "react";
import AddSortFilterClass from "@components/add-sort-filter-class";
import CreateClassPopup from "@components/create-class-popup";
import { SortStrategyKey, sortStrategies } from "@type/sortFilter";
import { useRecoilState } from "recoil";
import { filterSelector, sortSelector } from "@recoil/sort-filter-class";
import { Class } from "@type/dataTypes";
import { getAllClassesV2 } from "@base/api/classes";
import dayjs from "dayjs";
import { toastWrong } from "@base/utility/toast";

const ClassPage = () => {
  const [sortStrategy, setSortStrategy] = useRecoilState(sortSelector);
  const [filterFunctions, setFilterFunctions] = useRecoilState(filterSelector);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] =
    useState<boolean>(false);

  const applySortFilter = (classes: Class[]): Class[] => {
    let classesCopy = [...classes];
    if (filterFunctions.length > 0) {
      filterFunctions.forEach((fn) => {
        classesCopy = fn(classesCopy);
      });
    }

    if (sortStrategy) {
      sortStrategies[sortStrategy]?.sort(classesCopy);
    }

    return classesCopy;
  };

  const getClassData = async () => {
    const classesData = await getAllClassesV2();
    if (classesData.data === undefined) {
      toastWrong("Something went wrong.");
      return;
    }
    const mappedClasses: Class[] = classesData.data.map((classData) => {
      return {
        id: classData.id,
        day: classData.startDay.toString(),
        startTime: dayjs(classData.startTime, "HH:mm:ssZ"),
        endTime: dayjs(classData.endTime, "HH:mm:ssZ"),
        learningCentre: classData?.centre?.name ?? "",
        teachers: classData.teachers ?? [],
        students: classData.students ?? [],
      };
    });
    const sortedFilteredClasses = applySortFilter(mappedClasses);
    setClasses(sortedFilteredClasses);
  };

  // Unselect, reset sort and filter on load
  useEffect(() => {
    setSortStrategy(SortStrategyKey.SORT_DAY_ASC);
    setFilterFunctions([]);
    getClassData();
  }, []);

  useEffect(() => {
    const sortedFilteredClasses = applySortFilter(classes);
    setClasses(sortedFilteredClasses);
  }, [sortStrategy, filterFunctions]);

  const handleAddClass = () => {
    getClassData();
    setIsCreateClassModalOpen(false);
  };
  return (
    <div className='flex flex-grow flex-col overflow-y-auto'>
      <CreateClassPopup
        handleClassAdded={handleAddClass}
        popUpTitle='Create Class'
        open={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
      />
      <div className='flex justify-between items-center mr-10'>
        <PageTitle title='Classes' />
        <AddSortFilterClass
          classes={classes}
          handleAddClass={() => setIsCreateClassModalOpen(true)}
        />
      </div>
      <ClassCards classes={classes} />
    </div>
  );
};

export default ClassPage;
