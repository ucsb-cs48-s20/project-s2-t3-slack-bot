import React from "react";
import { addDecorator } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withKnobs } from "@storybook/addon-knobs";

import "bootstrap/dist/css/bootstrap.min.css";
//import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// npm run storybook gave an error because this line, but the storybook css seems to work fine with it commented out...

addDecorator(withA11y);
addDecorator(withKnobs);
