import { Theme, Color, fade } from "@material-ui/core";

export const outlinedStyle = (color: Color) => {
  return {
    border: `1px solid ${fade(color[500], 0.5)}`,
    "&:hover": {
      border: `1px solid ${color[500]}`
    }
  };
};

export const textStyle = (theme: Theme, color: Color) => {
  return {
    color: color[500],
    "&:hover": {
      backgroundColor: fade(color[500], theme.palette.action.hoverOpacity),
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  };
};

export const outLinedButton = (theme: Theme, color: Color) => {
  return {
    ...outlinedStyle(color),
    ...textStyle(theme, color)
  };
};

export const containedButton = (theme: Theme, color: Color) => {
  return {
    color: theme.palette.getContrastText(color[900]),
    backgroundColor: color[500],
    "&:hover": {
      backgroundColor: color[700],
      "@media (hover: none)": {
        backgroundColor: color[500]
      }
    }
  };
};
