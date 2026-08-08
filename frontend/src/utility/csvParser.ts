import { OptionData } from "@base/type/createClassPopUp";
import { parse, ParseError } from "papaparse";

// eslint-disable-next-line
// Takes in a file, and optionally function to validate the data and to extract the data
export const handleParse = (
  file: File,
  validate?: (
    data: OptionData[],
    headers: string[],
    errors?: ParseError[],
  ) => boolean,
  extractData?: (data: OptionData[], file: File, headers?: string[]) => void,
) => {
  // Event listener on reader when the file
  // loads, we parse it and set the data.
  parse(file, {
    skipEmptyLines: true,
    header: true,
    complete: (result) => {
      if (
        validate &&
        validate(
          result.data as OptionData[],
          result.meta.fields || [],
          result.errors,
        )
      ) {
        extractData &&
          extractData(
            result.data as OptionData[],
            file,
            result.meta.fields || [],
          );
      }
    },
  });
};
