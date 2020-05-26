import React from "react";
import { select, text } from "@storybook/addon-knobs";
import Layout from "../components/Layout";

export default {
  title: "Layout",
  component: Layout,
};

export const LayoutExists = () => {
  return <Layout />;
};
