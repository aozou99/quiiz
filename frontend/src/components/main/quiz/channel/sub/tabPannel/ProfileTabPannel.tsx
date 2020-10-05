import {
  Box,
  Container,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { EditableTextField } from "components/common/input/EditableTextField";
import React, { useEffect, useState } from "react";
import { useFetchQuiizUser } from "services/auth/AuthHooks";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkIcon from "@material-ui/icons/Link";
import AuthService from "services/auth/AuthService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    twitterLabel: {
      display: "flex",
      placeItems: "center",
      marginBottom: theme.spacing(0.5),
    },
    twitterForm: {
      width: theme.spacing(30),
      marginTop: theme.spacing(2),
    },
    mySiteLabel: {
      display: "flex",
      placeItems: "center",
      marginBottom: theme.spacing(0.5),
    },
    mySiteForm: {
      marginTop: theme.spacing(2),
    },
  })
);
export const ProfileTabPannel = ({ channelId }: { channelId: string }) => {
  const classes = useStyles();
  const { user, loaded, isMe } = useFetchQuiizUser(channelId);
  const [description, setDescription] = useState("");
  const [twitterAccount, setTwitterAccount] = useState("");
  const [mySiteUrl, setMySiteUrl] = useState("");

  const handleSaveDescription = async (description: string) => {
    AuthService.updateQuiizAuth({ description });
  };
  const handleSaveTwitterAccount = async (twitterAccount: string) => {
    AuthService.updateQuiizAuth({ twitterAccount });
  };
  const handleSaveMySiteUrl = async (mySiteUrl: string) => {
    AuthService.updateQuiizAuth({ mySiteUrl });
  };

  useEffect(() => {
    if (loaded && user) {
      setDescription(user.description);
      setTwitterAccount(user.twitterAccount);
      setMySiteUrl(user.mySiteUrl);
    }
  }, [loaded, user]);

  return (
    <Container maxWidth={"sm"} className={classes.root}>
      <EditableTextField
        editable={isMe}
        value={description}
        valueName={"自己紹介"}
        setValueState={setDescription}
        fontSize="body1"
        required={false}
        variant={"filled"}
        maxLength={150}
        placeholder={"自己紹介を書いてみましょう！"}
        multiline
        rows={4}
        onSave={handleSaveDescription}
      />
      <Box className={classes.twitterForm}>
        <Box className={classes.twitterLabel}>
          <TwitterIcon className={classes.icon} color="primary" />
          <Typography variant="subtitle1">Twitterアカウント名</Typography>
        </Box>
        <EditableTextField
          editable={isMe}
          value={twitterAccount}
          valueName={"Twitterアカウント名"}
          setValueState={setTwitterAccount}
          type="twitter"
          fontSize="body1"
          required={false}
          variant={"filled"}
          maxLength={15}
          placeholder={"@なしで入力"}
          rows={1}
          onSave={handleSaveTwitterAccount}
        />
      </Box>
      <Box className={classes.mySiteForm}>
        <Box className={classes.mySiteLabel}>
          <LinkIcon className={classes.icon} color="action" />
          <Typography variant="subtitle1">あなたのサイト</Typography>
        </Box>
        <EditableTextField
          editable={isMe}
          value={mySiteUrl}
          valueName={"あなたのサイト"}
          setValueState={setMySiteUrl}
          type="link"
          fontSize="body1"
          required={false}
          variant={"filled"}
          maxLength={50}
          placeholder={"https://example.com/"}
          rows={1}
          onSave={handleSaveMySiteUrl}
        />
      </Box>
    </Container>
  );
};
