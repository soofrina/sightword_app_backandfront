import { selector } from "recoil";
import atom from "@recoil/sort-filter-class";
import { SortStrategyKey } from "@base/type/sortFilter";

const sortSelector = selector<SortStrategyKey>({
  key: "sortSelector",
  get: ({ get }) => get(atom).sortStrategy,
  set: ({ get, set }, newValue) => {
    set(atom, { sortStrategy: newValue as SortStrategyKey, filters: get(atom).filters });
  },
});

export default sortSelector;
