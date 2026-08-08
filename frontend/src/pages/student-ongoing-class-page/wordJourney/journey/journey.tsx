import { ReactComponent as Radio } from "./radio.svg";
import { ReactComponent as RadioSelected } from "./selectedRadio.svg";

type JourneyProps = {
  word: string;
  isCompleted?: boolean;
  isChangeRequired?: boolean;
};

const Journey = ({
  word,
  isCompleted = false,
  isChangeRequired = false,
}: JourneyProps) => {
  return (
    <div className='flex flex-row'>
      {isCompleted ? (
        <RadioSelected className='self-center' />
      ) : (
        <Radio className='self-center' />
      )}
      <div className='self-center ml-2'>
        {word}
        {isChangeRequired && (
          <span style={{ color: "red" }}> (Change Required)</span>
        )}
      </div>
    </div>
  );
};

export default Journey;
