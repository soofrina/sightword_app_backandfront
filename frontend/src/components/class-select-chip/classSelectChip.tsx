
export interface ClassSelectChipProps {
    text: string;
    selected?: boolean;
    onClick: () => void
}

const ClassSelectChip = ({ text, selected, onClick }: ClassSelectChipProps) => {
    return (
        <div onClick={onClick} className={`${selected && "bg-[#D9D9D9] dark:text-black"} mx-1 py-1 px-2 border-solid border-2 border-black dark:border-white rounded-lg whitespace-nowrap hover:cursor-pointer`}>
            <p className="text-xs font-bold">
                {text}
            </p>
        </div>
    );

};

export default ClassSelectChip;
