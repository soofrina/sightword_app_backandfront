export enum ProgressStageStatus {
  NOT_ATTEMPTED = 0,
  IN_PROGRESS = 1,
  PENDING = 2,
  FAILED = 3,
  PASSED = 4,
}

export const getBackgroundColor = (status: ProgressStageStatus) => {
  switch (status) {
    case ProgressStageStatus.NOT_ATTEMPTED:
      return "";
    case ProgressStageStatus.IN_PROGRESS:
      return "secondary.dark";
    case ProgressStageStatus.PASSED:
      return "success.main";
    case ProgressStageStatus.FAILED:
      return "error.main";
    case ProgressStageStatus.PENDING:
      return "warning.main";
  }
};
