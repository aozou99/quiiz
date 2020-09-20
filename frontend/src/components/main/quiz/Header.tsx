import React from "react";
import "firebase/auth";
import { useTheme, useMediaQuery } from "@material-ui/core";
import DeskTopHeader from "components/common/header/DeskTopHeader";
import MobileHeader from "components/common/header/MobileHeader";

type State = {
  handleDrawer: (event: {}) => void;
};

const Header: React.FC<State> = ({ handleDrawer }) => {
  const theme = useTheme();
  const isSmallerSm = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return isSmallerSm ? (
    <MobileHeader />
  ) : (
    <DeskTopHeader handleDrawer={handleDrawer} />
  );
};

export default Header;
