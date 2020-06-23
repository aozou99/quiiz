import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
  Divider,
  Typography,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Tooltip,
  Collapse,
  Card,
  CardHeader,
  Avatar,
  CardContent,
} from "@material-ui/core";
import Item from "components/main/quiz/single/sub/Item";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import Choices from "components/main/quiz/preview/sub/Choices";
import { ExerciseResult } from "types/ExerciseTypes";
import FolderIcon from "@material-ui/icons/Folder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { themeColors } from "components/core/CustomeTheme";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      "& > *": {
        margin: theme.spacing(1),
      },
      flex: "5",
      [theme.breakpoints.down("xs")]: {
        flex: "4",
      },
    },
    detail: {
      flex: "3",
      [theme.breakpoints.down("xs")]: {
        flex: "5",
      },
      backgroundColor: "white",
      margin: theme.spacing(1),
      maxWidth: theme.spacing(70),
      minWidth: theme.spacing(56),
      padding: theme.spacing(2),
      position: "sticky",
      top: theme.spacing(10),
      overflowY: "auto",
      height: "85vh",
      "& > img": {
        display: "block",
        margin: "auto",
        marginBottom: theme.spacing(1),
        borderRadius: theme.spacing(1),
      },
      "& > hr": {
        margin: theme.spacing(1),
      },
    },
    iconSelectedPink: {
      "&.Mui-selected": {
        color: themeColors.secondary[500],
      },
    },
    iconSelectedYellow: {
      "&.Mui-selected": {
        color: themeColors.quaternary[500],
      },
    },
    description: {
      whiteSpace: "pre-line",
      backgroundColor: "rgba(0, 0, 0, 0.87)",
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& .MuiCardHeader-root, .MuiCardContent-root": {
        padding: theme.spacing(1),
      },
      "& .MuiCardHeader-root": {
        paddingBottom: theme.spacing(0),
      },
      color: "white",
      "& .MuiCardHeader-content": {
        color: themeColors.primary[400],
        "& .MuiTypography-root": {
          fontWeight: "bold",
        },
      },
    },
    avatorSizeSmall: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      backgroundColor: themeColors.primary[400],
    },
  })
);

type quiz = {
  id: number;
  imgPath: string;
  title: string;
  author: string;
  authorImgPath: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  answer: 0 | 1 | 2 | 3;
  description: string;
};

type Props = {
  itemList: quiz[];
};

const ItemList: React.FC<Props> = ({ itemList }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState<quiz>();
  const [result, setResult] = useState<ExerciseResult>(undefined);
  const choices = (e: quiz): [string, string, string, string] => [
    e.selectA,
    e.selectB,
    e.selectC,
    e.selectD,
  ];
  const [value, setValue] = React.useState("");

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    if (newValue === "detail" && !result) {
      return;
    }
    setValue(newValue);
  };

  return (
    <Box className={clsx(classes.root)}>
      <Box className={classes.list}>
        {itemList.map((item) => (
          <Item
            imgPath={item.imgPath}
            title={item.title}
            author={item.author}
            authorImgPath={item.authorImgPath}
            handleClick={() => {
              if (selected === item) {
                setSelected(undefined);
              } else {
                setSelected(item);
                setResult(undefined);
              }
            }}
            isSelected={selected === item}
          />
        ))}
      </Box>
      {selected && (
        <Paper elevation={1} className={classes.detail}>
          <img src={selected.imgPath} alt={selected.title} />
          <Typography align="center" variant="subtitle1">
            {selected.title}
          </Typography>
          <Divider />
          <Choices
            result={result}
            setResult={setResult}
            choices={choices(selected)}
            answer={selected.answer}
          />
          <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction
              value="good"
              icon={
                <Tooltip title="いいね">
                  <FavoriteIcon />
                </Tooltip>
              }
              showLabel={false}
              className={classes.iconSelectedPink}
            />
            <BottomNavigationAction
              value="folder"
              icon={
                <Tooltip title="リストに追加">
                  <FolderIcon />
                </Tooltip>
              }
              showLabel={false}
              className={classes.iconSelectedYellow}
            />
          </BottomNavigation>
          <Collapse
            in={!!result && (selected?.description?.length || 0) > 0}
            timeout="auto"
            unmountOnExit
          >
            <Card className={classes.description} elevation={2}>
              <CardHeader
                title={<Typography variant={"subtitle1"}>Tips</Typography>}
                avatar={
                  <Avatar
                    aria-label="description"
                    className={classes.avatorSizeSmall}
                  >
                    ?
                  </Avatar>
                }
              />
              <CardContent>
                <Typography variant={"body1"}>
                  {selected.description}
                </Typography>
              </CardContent>
            </Card>
          </Collapse>
        </Paper>
      )}
    </Box>
  );
};

export default ItemList;
