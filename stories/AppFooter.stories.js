import React from "react";
import { select, text } from "@storybook/addon-knobs";
import AppFooter from "../components/AppFooter";

export default {
  title: "AppFooter",
  component: AppFooter,
};

export const footerExists = () => {
  return <AppFooter />;
};
