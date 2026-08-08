import { ReactComponent as Attached1 } from "./attached1.svg";
import { ReactComponent as Attached2 } from "./attached2.svg";

type LineHandlerProps = {
    side: number;
  };

const LineHandler = ({side}: LineHandlerProps) => {
    const pos = side === 0 ? <Attached1/> : <Attached2/>;
    return ( 
        <div className="flex flex-row h-2 justify-center">
            {pos}
        </div>
     );
};
 
export default LineHandler;