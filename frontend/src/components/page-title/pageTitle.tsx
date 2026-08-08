import { Typography } from "@mui/material";

export interface PageTitleProps {
  numItems?: number;
  title: string;
}

const PageTitle = ({ numItems, title }: PageTitleProps) => {
  return (
    <div className='m-6'>
      <div className='inline-flex items-end'>
        <Typography
          sx={{ color: "text.primary" }}
          className='ml-6 text-4xl font-bold'
        >
          {title}
        </Typography>
        {numItems && <p className='ml-6 mb-1 text-sublineText'>{numItems}</p>}
      </div>
    </div>
  );
};

export default PageTitle;
