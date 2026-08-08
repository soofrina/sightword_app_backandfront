import { ComponentStory, ComponentMeta } from "@storybook/react";
import TailwindSample from "./TailwindSample";

export default {
  title: "Tailwind/Sample",
  component: TailwindSample,
} as ComponentMeta<typeof TailwindSample>;

const Template: ComponentStory<typeof TailwindSample> = (args) => (
  <TailwindSample />
);

export const Sample = Template.bind({});
