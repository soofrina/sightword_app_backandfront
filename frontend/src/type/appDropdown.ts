export interface OptionData {
  title: string;
  id: number;
  href?: string;
  onClick?: () => void;
}

export enum DropdownVariant {
  SOLID = "contained",
  GHOST = "text",
}

export enum DropdownColor {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}
