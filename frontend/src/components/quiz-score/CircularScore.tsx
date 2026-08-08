interface CircularProgressProps {
  radius: number;
  strokeWidth: number;
  percentage: number;
}

const CircularProgress = ({
  radius,
  strokeWidth,
  percentage,
}: CircularProgressProps) => {
  const circleRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = ((100 - percentage) / 100) * circumference;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx={radius}
        cy={radius}
        r={circleRadius}
        stroke='lightgray'
        strokeWidth={strokeWidth}
        fill='transparent'
      />
      <circle
        cx={radius}
        cy={radius}
        r={circleRadius}
        stroke='url(#progressGradient)'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        fill='transparent'
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
      <defs>
        <linearGradient
          id='progressGradient'
          x1='100%'
          y1='100%'
          x2='0%'
          y2='0%'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F4A295' />
          <stop offset='1' stopColor='#FFE5DA' />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CircularProgress;
