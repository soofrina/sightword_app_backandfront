export const dayNumToString = (dayNum: number | undefined) => {
  switch (dayNum) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Invalid day";
  }
};

export const StringToDayNum = (day: string) => {
  switch (day) {
    case "Sunday":
      return 0;
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
    case "Friday":
      return 5;
    case "Saturday":
      return 6;
    default:
      return -1;
  }
};

export function convertTimeStringToFormat(timeString: string): string {
  // Use the current date and provided time to create a full timestamp
  const currentDate = new Date();
  const [hours, minutes] = timeString.split(":");
  currentDate.setHours(parseInt(hours), parseInt(minutes), 0);

  // Get the timezone offset
  const timeZoneOffset = 0;

  // Format the result as a string
  return `${currentDate.toISOString().substr(11, 8)}${
    timeZoneOffset >= 0 ? "+" : "-"
  }${Math.abs(timeZoneOffset / 60)
    .toString()
    .padStart(2, "0")}00`;
}
