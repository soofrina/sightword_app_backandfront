import React from "react";
import { Meta, Story } from "@storybook/react";

import AppButton from "@components/app-button";
import { ButtonVariant, ButtonColor } from "@base/type/appButton";

export default {
  title: "app-button/appButton",
  component: AppButton,
  argTypes: {
    "button text": {
      control: { type: "text" },
    },
    variant: {
      options: [
        ButtonVariant.SOLID,
        ButtonVariant.OUTLINED,
        ButtonVariant.GHOST,
      ],
      control: {
        type: "radio",
      },
    },
    color: {
      options: [
        ButtonColor.PRIMARY,
        ButtonColor.SECONDARY,
        ButtonColor.SUCCESS,
        ButtonColor.DANGER,
      ],
      control: {
        type: "radio",
      },
    },
  },
} as Meta;

export const Default: Story = (args) => {
  return <AppButton {...args}>Press Me</AppButton>;
};
