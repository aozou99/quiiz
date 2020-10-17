import {
  Typography,
  Box,
  makeStyles,
  Theme,
  createStyles,
  Tabs,
  Tab,
  Divider,
} from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabsRoot: {
      maxWidth: "100vw",
      "&>div>div>button": {
        minWidth: theme.spacing(16),
      },
    },
    paddingLeft: {
      paddingLeft: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        paddingLeft: theme.spacing(0),
      },
    },
  })
);

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface TabProps {
  childPannel: React.ReactNode;
  tabLabel: string;
  tabIcon?: string | React.ReactElement;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`basic-tabpanel-${index}`}
      aria-labelledby={`basic-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
};

export const BasicTab: React.FC<{
  tabsprops: TabProps[];
  tabsClassName?: string;
  selectedTab?: number;
}> = ({ tabsprops, tabsClassName, selectedTab = 0 }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(selectedTab);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const tabs = useMemo(() => {
    return tabsprops.map((props, i) => (
      <Tab
        key={i}
        label={props.tabLabel}
        icon={props.tabIcon}
        {...a11yProps(i)}
      />
    ));
  }, [tabsprops]);
  const tabPanel = useMemo(() => {
    return tabsprops.map((props, i) => (
      <TabPanel key={i} value={value} index={i}>
        {props.childPannel}
      </TabPanel>
    ));
  }, [value, tabsprops]);

  useEffect(() => {
    setValue(selectedTab);
  }, [selectedTab]);
  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic-tab"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="off"
        textColor="primary"
        className={clsx(classes.paddingLeft, tabsClassName, classes.tabsRoot)}
      >
        {tabs}
      </Tabs>
      <Divider variant="fullWidth" />
      {tabPanel}
    </>
  );
};
