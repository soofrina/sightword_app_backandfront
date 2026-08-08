import { SortOrder } from "@type/reviewWords";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";

interface SortOptionProps {
  sortOrder: SortOrder | undefined;
  isSelected: boolean;
  name: string;
}

const getDirectionIcon = (sortOrder: SortOrder | undefined) => {
  if (!sortOrder) {
    return null;
  } else if (sortOrder === SortOrder.ASCENDING) {
    return <ChevronUpIcon className='h-5 w-5' />;
  } else {
    return <ChevronDownIcon className='h-5 w-5' />;
  }
};

const SortOption = ({ sortOrder, isSelected, name }: SortOptionProps) => {
  return (
    <div className='flex justify-between'>
      <p>{name}</p>
      {isSelected && getDirectionIcon(sortOrder)}
      {!sortOrder && <ChevronUpDownIcon className='h-5 w-5' />}
    </div>
  );
};

export default SortOption;
