import React, { ChangeEvent, useEffect, useState } from "react";

import { GridColDef, GridRenderCellParams, GridSelectionModel } from "@mui/x-data-grid";

import DeleteLearningCentresPopUp from "./deleteLearningCentresPopUp";
import EditLearningCentrePopUp from "./editLearningCentresPopUp";
import Table from "@base/components/Table";
import AppButton from "@base/components/app-button";
import SearchBar from "@base/components/search-bar";

import { useQuery } from "@tanstack/react-query";
import { getAllCentres } from "@base/api/centres";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PencilIcon } from "assets/PencilIcon.svg";
import { ReactComponent as ThrashIcon } from "assets/ThrashIcon.svg";
import AddLearningCentrePopUp from "./addLearningCentrePopUp";

export type LearningCentreRowFormat = {
  id: string;
  name: string;
}

const learningCentreTab: React.FC = () => {
  const [showDeleteLCs, setShowDeleteLCs] = useState<boolean>(false);
  const [showEditLC, setShowEditLC] = useState<boolean>(false);
  const [showCreateLC, setShowCreateLC] = useState<boolean>(false);

  // Pop Up data
  const [selectionIds, setSelectionIds] = useState<GridSelectionModel>([]);
  const [toDeleteLCs, setToDeleteLCs] = useState<LearningCentreRowFormat[]>([]);
  const [toEditLC, setToEditLC] = useState<LearningCentreRowFormat | undefined>();
  const [showAltControl, setShowAltControl] = useState<boolean>(false);

  // Table data
  const [tableRows, setTableRows] = useState<LearningCentreRowFormat[]>([]);
  const [filteredTableRows, setFilteredTableRows] = useState<LearningCentreRowFormat[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const [getAllCentresKey] = useState<string>("getAllCentres");

  const { data: getAllLCData, refetch: refetchLCData } = useQuery([getAllCentresKey], () => { 
    return getAllCentres();
  });

  // hot reload on component update
  useEffect(() => {
    refetchLCData();
  }, []);

  useEffect(() => {
    if (!getAllLCData?.data) return;

    setTableRows(getAllLCData.data.map((lc): LearningCentreRowFormat => ({
      id: lc.id,
      name: lc.name,
    })));
  }, [getAllLCData]);

  useEffect(() => {
    let filteredRows = tableRows;

    // filter
    filteredRows = filteredRows.filter((lc) =>
      lc.name.toLowerCase().includes(searchFilter.toLowerCase()),
    ); 

    setFilteredTableRows(filteredRows);
  }, [tableRows, searchFilter]);

  const onTableSelectionChange = (s: GridSelectionModel) => {
    setSelectionIds(s);
    setShowAltControl(s.length > 0);
  };

  const onEditButtonOnClick = (row: LearningCentreRowFormat) => {
    setToEditLC(row);
    setShowEditLC(true);
  };

  const onDeleteSelectionOnClick = () => {
    setToDeleteLCs(tableRows.filter((value: LearningCentreRowFormat) => selectionIds.includes(value.id)));
    setShowDeleteLCs(true);
  };

  const onDeleteButtonOnClick = (row: LearningCentreRowFormat) => {
    setToDeleteLCs([row]);
    setShowDeleteLCs(true);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Learning Centre",
      flex: 1,
    },
    {
      field: " ",
      headerName: " ",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className='flex flex-row gap-2 items-center justify-start'>
            <SvgIcon
              component={PencilIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px", cursor: "pointer" }}
              onClick={() => onEditButtonOnClick(params.row)}
            />
            <SvgIcon
              component={ThrashIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px", cursor: "pointer" }}
              onClick={() => onDeleteButtonOnClick(params.row)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full px-4 py-2 flex flex-row justify-between items-center bg-secondaryMain dark:bg-primaryLight-d">
        <SearchBar className="h-10" placeholder="Search" 
          onChange={(event: ChangeEvent<HTMLInputElement>) => { setSearchFilter(event.target.value); }}
        />
        {!showAltControl && <AppButton onClick={() => setShowCreateLC(true)}>Add Learning Centre</AppButton>}
        {showAltControl && <ThrashIcon className="hover:cursor-pointer" onClick={onDeleteSelectionOnClick} />}
      </div>

      <Table 
        columns={columns} 
        rows={filteredTableRows}
        onSelectionChange={onTableSelectionChange}
        showCheckBox
      />

      <AddLearningCentrePopUp
        open={showCreateLC}
        onClose={() => {
          refetchLCData();
          setShowCreateLC(false);
        }}
      />

      <EditLearningCentrePopUp 
        open={showEditLC} 
        onClose={() => {
          refetchLCData();
          setShowEditLC(false);
        }}
        toEdit={toEditLC}
      />

      <DeleteLearningCentresPopUp 
        open={showDeleteLCs} 
        onClose={() => {
          refetchLCData();
          setShowDeleteLCs(false);
        }}
        toDelete={toDeleteLCs}
      />
    </>
  );
};

export default learningCentreTab;