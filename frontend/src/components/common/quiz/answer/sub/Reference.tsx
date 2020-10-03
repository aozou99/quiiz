import {
  CardHeader,
  Typography,
  CardContent,
  ListItem,
  ListItemIcon,
  ListItemText,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { themeColors } from "components/core/CustomeTheme";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    reference: {
      color: themeColors.tertiary[400],
    },
    referenceIcon: {
      minWidth: theme.spacing(4),
    },
    referenceLink: {
      padding: theme.spacing(0.5, 1),
      marginBottom: theme.spacing(0.5),
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 1.00)",
      },
    },
    borderBottom: {
      borderBottom: `thin solid`,
    },

    borderLeftPrimary: {
      color: themeColors.primary["A200"],
      borderLeft: `medium solid ${themeColors.primary[400]}`,
    },
    borderLeftrTertiary: {
      color: themeColors.tertiary["A200"],
      borderLeft: `medium solid ${themeColors.tertiary[400]}`,
    },
    borderLeftQuaternary: {
      color: themeColors.quaternary["A200"],
      borderLeft: `medium solid ${themeColors.quaternary[400]}`,
    },
  })
);
export const Reference = ({ references }: { references: any[] }) => {
  const classes = useStyles();
  const borderLeftColors = [
    classes.borderLeftrTertiary,
    classes.borderLeftQuaternary,
    classes.borderLeftPrimary,
  ];

  return (
    <>
      <CardHeader
        title={
          <Typography
            variant={"subtitle1"}
            className={clsx(classes.reference, classes.borderBottom)}
          >
            参考記事
          </Typography>
        }
      />
      <CardContent>
        {references.map((ref, i) => (
          <ListItem
            key={i}
            button
            component="a"
            href={ref.requestUrl}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className={clsx(borderLeftColors[i % 3], classes.referenceLink)}
          >
            <ListItemIcon className={classes.referenceIcon}>
              <img
                src={`https://www.google.com/s2/favicons?domain=${
                  new URL(ref.requestUrl).hostname
                }`}
                loading="lazy"
                alt={"favicon"}
              />
            </ListItemIcon>
            <ListItemText
              primary={ref.ogTitle}
              secondary={
                ref.ogVideo && (
                  <iframe
                    title={ref.ogTitle}
                    src={ref.ogVideo.url}
                    loading="lazy"
                    width="100%"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )
              }
            />
          </ListItem>
        ))}
      </CardContent>
    </>
  );
};
