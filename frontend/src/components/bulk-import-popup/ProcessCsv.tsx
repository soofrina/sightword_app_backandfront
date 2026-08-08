import { useEffect, useRef, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CancelIcon } from "assets/Cancel.svg";

interface ProcessCsvProps {
    fileChosen: File;
    validationSuccess: boolean;
    columns: string[];
    setCreateData: (arg: any[]) => void;
    handleCancelUpload: () => void;
}

const ProcessCsv = ({ fileChosen, validationSuccess, columns, handleCancelUpload, setCreateData }: ProcessCsvProps) => {
    const [processingProgress, setProcessingProgress] = useState<number>(0);
    const createData = useRef<any[]>([]);

    useEffect(() => {
      if (!validationSuccess) return;
  
      const reader = new FileReader();
  
      reader.onload = e => {
        const data = e.target?.result;
        const result = data?.toString().split("\n");

        createData.current = [];

        const indexes: { [id: string] : number } = {};
        
        result?.forEach((line, index) => { 
          line = line.trim();
          if (index === 0) {
            line.split(",").forEach((col, colIndex) => {
              if (columns.includes(col.trim())) {
                indexes[col.trim()] = colIndex;
              }
            });
          }
          else {  
            if (line === undefined || line === "") { 
              // end of file
              setCreateData(createData.current);
            }
            else {
              const splitStr = line.split(",");

              const mappedValues: { [id: string] : string } = {};
              for (const col in indexes) {
                mappedValues[col] = splitStr[indexes[col]];
              }
              
              createData.current.push(mappedValues);
            }
          }

          const progress = (index + 1) / result.length * 100; 
          setProcessingProgress(progress);
        });
      };
  
      reader.readAsText(fileChosen);
  
    }, [validationSuccess]);

    return <div className="flex flex-col items-center gap-2 w-full h-full">
        <div className="flex flex-row gap-2 items-center">
            <Typography 
                variant="caption" 
                className="text-center overflow-hidden overflow-ellipsis"
                sx={{ color: "#ABABAB", width: "100%" }}
            >Uploading: {fileChosen?.name}</Typography>

            <SvgIcon component={CancelIcon} viewBox="0 0 14 14" sx={{ width: "14px" }} onClick={handleCancelUpload} />
        </div>
    
        <LinearProgress 
            variant="determinate" 
            value={processingProgress}
            className="rounded"
            // color="primary"
            sx={{
                width: "20%",
                height: "8px",
                backgroundColor: "#D9D9D9",
                "& .MuiLinearProgress-bar": {
                    borderRadius: "1em",
                    backgroundColor: "#F4A295",
                }
            }}
        />
    </div>;
};

export default ProcessCsv;