import { ReactNode } from "react";

export interface RenderFnProps {
  name: string;
}

export interface OptionData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  name: string;
  id: string | number;
  renderFn?: (props: RenderFnProps) => ReactNode;
}
