export type Detail = {
  id: string;
  key: string;
  value: string;
};

interface DetailsListProps {
  details: Detail[];
  short?: boolean;
}

const DetailsList = ({ details, short = false }: DetailsListProps) => {
  return (
    <div
      className={`flex flex-col w-full ${short && "max-h-40"} overflow-auto`}
    >
      {details.map((detail, idx) => {
        return (
          <div key={detail.key}>
            <div className='flex py-2 text-textPrimary dark:text-textPrimary-d'>
              <p className='flex justify-start w-1/2'>{detail.key}</p>
              <p className='flex justify-end text-right w-1/2'>
                {detail.value}
              </p>
            </div>
            {idx < details.length - 1 && <hr className='w-full' />}
          </div>
        );
      })}

      {details.length === 0 && (
        <p className='text-textSecondary dark:text-textSecondary-d'>
          No classes found
        </p>
      )}
    </div>
  );
};

export default DetailsList;
