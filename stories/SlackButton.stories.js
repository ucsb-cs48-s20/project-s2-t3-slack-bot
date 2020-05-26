import React from "react";
import { select, text } from "@storybook/addon-knobs";
import SlackButton from "../components/SlackButton";

export default {
  title: "SlackButton",
  component: SlackButton,
};

export const buttonExists = () => {
  return <SlackButton />;
};
