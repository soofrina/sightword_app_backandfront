import { selector } from "recoil";
import atom from "@recoil/sort-filter-class";
import { Class } from "@base/type/dataTypes";

const filterSelector = selector<((classes: Class[]) => Class[])[]>({
  key: "filterSelector",
  get: ({ get }) => get(atom).filters,
  set: ({ get, set }, newValue) => {
    set(atom, { 
      sortStrategy: get(atom).sortStrategy,
      filters: newValue as ((classes: Class[]) => Class[])[],
    });
  },
});

export default filterSelector;
