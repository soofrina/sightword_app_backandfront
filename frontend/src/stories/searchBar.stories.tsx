import React from "react";
import { Meta, Story } from "@storybook/react";

import SearchBar from "@components/search-bar";

export default {
  title: "seach-bar/searchBar",
  component: SearchBar,
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Default: Story = (args) => {
  return <SearchBar placeholder='Search...' {...args} />;
};
