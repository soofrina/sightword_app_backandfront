import AppButton from "@components/app-button";
import { ButtonVariant } from "@type/appButton";
import AddIcon from "@mui/icons-material/Add";
import AppDropdown from "@components/app-dropdown";
import { DropdownColor, DropdownVariant } from "@type/appDropdown";
import { filterSelector, sortSelector } from "@recoil/sort-filter-class";
import { useRecoilState } from "recoil";
import { FilterOption, sortStrategies } from "@type/sortFilter";
import AppSelect from "../app-select/AppSelect";
import { Class } from "@base/type/dataTypes";
import { useEffect, useState } from "react";
import { NumberToDay } from "@base/constants/datetime";

interface AddSortFilterClassProps {
  handleAddClass: () => void;
  classes: Class[];
}

const AddSortFilterClass = ({
  handleAddClass,
  classes,
}: AddSortFilterClassProps) => {
  const [sortStrategy, setSortStrategy] = useRecoilState(sortSelector);
  const [sortStrategyName, setSortStrategyName] = useState<string>("Day Sat->Sun");
  const [filterFunctions, setFilterFunctions] = useRecoilState(filterSelector);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    const options: FilterOption[] = [];
    const optionNames = new Set<string>();
    classes.forEach((c) => {
      // add learning centre of class as a filter option
      if (!optionNames.has(c.learningCentre)) {
        options.push({
          name: c.learningCentre,
          filter: (cls) =>
            cls.filter((cl) => cl.learningCentre === c.learningCentre),
        });
        optionNames.add(c.learningCentre);
      }

      // add day of class as a filter option
      if (!optionNames.has(c.day)) {
        options.push({
          name: NumberToDay[parseInt(c.day)],
          filter: (cls) => cls.filter((cl) => cl.day === c.day),
        });
        optionNames.add(c.day);
      }
    });

    setFilterOptions(options);
  }, [classes]);

  return (
    <div className='flex items-center'>
      <AppButton
        className='m-2'
        startIcon={<AddIcon />}
        variant={ButtonVariant.SOLID}
        onClick={handleAddClass}
      >
        Add Class
      </AppButton>
      <AppSelect
        dropdownVariant={DropdownVariant.GHOST}
        dropdownColor={DropdownColor.PRIMARY}
        data={Object.entries(sortStrategies).map((strategy, idx) => {
          return {
            value: strategy[0],
            name: strategy[1].name,
            id: idx,
          };
        })}
        onChange={(e) => {
          setSortStrategy(e.value);
          setSortStrategyName(e.name);
        }}
        value={{
          value: "",
          name: sortStrategyName,
          id: 0,
        }}
      />
      <AppDropdown
        className='m-2'
        title='Filter'
        data={filterOptions.map((fo, idx) => {
          return {
            title: fo.name,
            id: idx,
            onClick: () => setFilterFunctions([...filterFunctions, fo.filter]),
          };
        })}
        dropdownVariant={DropdownVariant.GHOST}
      />
    </div>
  );
};

export default AddSortFilterClass;
