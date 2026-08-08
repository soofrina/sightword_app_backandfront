import React from "react";
import { Meta, Story } from "@storybook/react";

import AppSelect from "@base/components/app-select";

const people = [
  { id: 1, name: "Wade Cooper", value: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy", value: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb", value: "Devon Webb" },
  { id: 4, name: "Tom Cook", value: "Tom Cook" },
  { id: 5, name: "Tanya Fox", value: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt", value: "Hellen Schmidt" },
  { id: 7, name: "Caroline Schultz", value: "Caroline Schultz" },
  { id: 8, name: "Mason Heaney", value: "Mason Heaney" },
  { id: 9, name: "Claudie Smitham", value: "Claudie Smitham" },
  { id: 10, name: "Emil Schaefer", value: "Emil Schaefer" },
];

export default {
  title: "app-select/appSelect",
  component: AppSelect,
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
    data: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Default: Story = (args) => {
  return (
    <AppSelect className='w-60' value={people[0]} data={people} {...args} />
  );
};
