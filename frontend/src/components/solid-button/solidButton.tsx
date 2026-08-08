type SolidButtonProps = {
  disabled?: boolean;
  content: string;
  width: number;
  onClick?: () => void;
};

const SolidButton = ({
  disabled = false,
  content,
  width,
  onClick = () => {
    console.log("Clicked SolidButton");
  },
}: SolidButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`flex flex-row justify-center items-center px-4 py-2 rounded-md text-white ${
        disabled ? "bg-textDisabled" : "bg-primaryMain"
      } w-${width} cursor-pointer`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default SolidButton;
