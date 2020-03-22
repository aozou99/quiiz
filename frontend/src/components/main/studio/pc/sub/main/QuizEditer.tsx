import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import BookIcon from "@material-ui/icons/Book";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import Divider from "@material-ui/core/Divider";
import ExerciseTable from "components/main/studio/pc/sub/main/table/ExerciseTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  paddingLeft: {
    paddingLeft: theme.spacing(3)
  }
}));

const QuizEditer: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.paddingLeft} paragraph>
        あなたが作成したクイズ
      </Typography>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        indicatorColor="primary"
        textColor="primary"
        className={classes.paddingLeft}
      >
        <Tab label="エクササイズ" icon={<BookIcon />} {...a11yProps(0)} />
        <Tab
          label="シリーズ"
          icon={<CollectionsBookmarkIcon />}
          {...a11yProps(1)}
        />
      </Tabs>
      <Divider variant="fullWidth" />
      <TabPanel value={value} index={0}>
        <ExerciseTable></ExerciseTable>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </div>
  );
};

export default QuizEditer;
