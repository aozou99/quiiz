import { createMuiTheme } from "@material-ui/core/styles";
import cyan from "@material-ui/core/colors/cyan";
import { pink, green, orange } from "@material-ui/core/colors";

export const themeColors = {
  primary: cyan,
  secondary: pink,
  tertiary: green,
  quaternary: orange
};

export default createMuiTheme({
  palette: {
    primary: themeColors.primary,
    secondary: themeColors.secondary
  }
});
