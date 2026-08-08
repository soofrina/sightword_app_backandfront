import { SortFilterState, SortStrategyKey } from "@type/sortFilter";
import { atom } from "recoil";

const initState: SortFilterState = {
  sortStrategy: SortStrategyKey.SORT_DAY_ASC,
  filters: [],
};

const sortFilterClassAtom = atom<SortFilterState>({
  key: "sortFilterClassAtom",
  default: initState,
});

export default sortFilterClassAtom;
