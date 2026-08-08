import React from "react";
import { Meta, Story } from "@storybook/react";

import AppDropdown from "@base/components/app-dropdown";
import { OptionData } from "@base/type/appDropdown";

export default {
  title: "app-dropdown/appDropdown",
  component: AppDropdown,
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
  },
} as Meta;

const data: OptionData[] = [
  { title: "Account Settings", id: 1 },
  { title: "Support", id: 2 },
  { title: "License", id: 3 },
  { title: "Sign Out", id: 4 },
];

export const Default: Story = (args) => {
  return <AppDropdown data={data} title='Options' {...args} />;
};
