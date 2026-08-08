import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridSelectionModel,
  gridPageCountSelector,
  gridPageSelector,
  gridPaginationRowRangeSelector,
  useGridApiContext,
  useGridSelector,
  GridFilterModel,
} from "@mui/x-data-grid";
import { Pagination } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

type RecordType = Record<string, unknown>;

export interface TableProps<T> {
  columns: GridColDef[];
  rows: T[];
  showCheckBox?: boolean;
  onSelectionChange?: (sm: GridSelectionModel) => void;
  filterModel?: GridFilterModel;
  className?: string;
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor:
      theme.palette?.mode === "dark" ? theme.palette.grey[700] : "#F7F7F7",
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor:
      theme.palette?.mode === "dark" ? theme.palette.grey[800] : "#fff",
  }
}));

const Table = <T extends RecordType>(props: TableProps<T>) => {
  const { columns, rows, showCheckBox, onSelectionChange, filterModel } = props;
  const [pageSize, setpageSize] = React.useState<string>("5");

  const customPagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const { firstRowIndex, lastRowIndex } = gridPaginationRowRangeSelector(
      apiRef,
    ) || { firstRowIndex: -1, lastRowIndex: -1 };

    const sizeSelector = () => {
      const handleChange = (event: SelectChangeEvent) => {
        setpageSize(event.target.value as unknown as string);
      };
      return (
        <FormControl sx={{ m: 1, minWidth: 50 }} size='small'>
          <Select
            labelId='page-size-select'
            id='page-size-select'
            value={pageSize}
            onChange={handleChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      );
    };

    return (
      <div className={"flex flex-row justify-between w-full items-center bg-backgroundPaper dark:bg-backgroundPaper-d"}>
        <span className='flex flex-row items-center'>
          &nbsp;Show {sizeSelector()} Rows
        </span>
        <div className='flex flex-row gap-x-2'>
          <span className='flex flex-row items-center'>
            {`${firstRowIndex + 1}-${lastRowIndex + 1} of ${rows.length}`}
          </span>
          <Pagination
            color='primary'
            variant='outlined'
            shape='rounded'
            size='medium'
            page={page + 1}
            count={pageCount}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        </div>
      </div>
    );
  };

  return (
    <Box className={`${props.className}`} sx={{ width: "100%" }}>
      <StripedDataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={parseInt(pageSize)}
        checkboxSelection={showCheckBox}
        onSelectionModelChange={onSelectionChange}
        isCellEditable={() => false}
        disableSelectionOnClick
        disableColumnMenu
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        components={{
          Pagination: customPagination,
        }}
        filterModel={filterModel}
      />
    </Box>
  );
};
export default Table;
