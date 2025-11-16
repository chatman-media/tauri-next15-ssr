import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { RoundedButton } from "./RoundedButton";

const meta = {
  title: "Components/RoundedButton",
  component: RoundedButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof RoundedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Click Me",
  },
};

export const CallGreet: Story = {
  args: {
    title: 'Call "greet" from Rust',
  },
};

export const LongText: Story = {
  args: {
    title: "This is a button with a very long text that might wrap",
  },
};

export const ShortText: Story = {
  args: {
    title: "Go",
  },
};
