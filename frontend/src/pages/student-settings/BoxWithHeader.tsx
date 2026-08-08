interface BoxWithHeaderProps {
  header: string;
  headerAction?: JSX.Element;
  children: JSX.Element;
}

const BoxWithHeader = ({
  header,
  headerAction,
  children,
}: BoxWithHeaderProps) => {
  return (
    <div className='bg-overlayMain dark:bg-overlayMain-d rounded max-w-[400px] my-4'>
      <div className='font-bold bg-secondaryMain dark:bg-primaryLight-d rounded-t py-2 px-2 flex justify-between'>
        <p>{header}</p>
        {headerAction}
      </div>
      <div className='px-2'>{children}</div>
    </div>
  );
};

export default BoxWithHeader;
