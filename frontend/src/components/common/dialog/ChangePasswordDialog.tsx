import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  FormGroup,
  makeStyles,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { BackDropContext } from "components/main/quiz/Main";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthUser } from "services/auth/AuthHooks";
import AuthService from "services/auth/AuthService";
import { ErrorMessage } from "@hookform/error-message";
import { PASSWORD_REGEX } from "utils/costant/Validate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formGroup: {
      maxWidth: theme.spacing(40),
    },
    button: {
      marginTop: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
      maxWidth: theme.spacing(10),
    },
  })
);

const renderErrorMessage = ({ message }: { message: string }) => (
  <Typography color="error" variant="caption">
    {message}
  </Typography>
);

export const ChangePasswordDialog = ({
  open,
  onClose,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { setOpenBackDrop } = useContext(BackDropContext);
  const { firebaseUser } = useAuthUser();
  const {
    register: registerN,
    errors: errorsN,
    handleSubmit: handleSubmitN,
  } = useForm<{
    new_password: string;
    new_password_confirm: string;
  }>();
  const {
    register: registerC,
    errors: errorsC,
    handleSubmit: handleSubmitC,
    setError: setErrorC,
  } = useForm<{
    current_password: string;
  }>();

  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = handleSubmitC(async ({ current_password }) => {
    setOpenBackDrop(true);
    try {
      const user = await AuthService.reAuthenticate(
        firebaseUser?.email || "",
        current_password
      )
        ?.then(cre => cre.user)
        .finally(() => setOpenBackDrop(false));
      user?.updatePassword(newPassword);
      onClose();
      onUpdated();
    } catch (error) {
      setErrorC("current_password", { message: "パスワードが間違ってます" });
    }
  });

  const handleNext = handleSubmitN(({ new_password, new_password_confirm }) => {
    if (new_password !== new_password_confirm) {
      alert("パスワードが確認用と一致しません");
      return;
    }
    setNewPassword(new_password);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  });

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const steps = [
    {
      label: "新しいパスワード",
      content: (
        <form onSubmit={handleNext} noValidate>
          <FormGroup className={classes.formGroup}>
            <TextField
              id="new_password"
              name="new_password"
              label={"新しいパスワード"}
              margin="dense"
              inputRef={registerN({
                required: "入力してください",
                pattern: {
                  value: PASSWORD_REGEX,
                  message: "8文字以上、大文字・小文字英数字を含んでください",
                },
              })}
              required
              error={!!errorsN.new_password}
              defaultValue={newPassword}
              type="password"
              autoComplete="off"
            />
            <ErrorMessage
              errors={errorsN}
              name="new_password"
              render={renderErrorMessage}
            />
            <TextField
              id="new_password_confirm"
              name="new_password_confirm"
              label={"新しいパスワード(確認用)"}
              margin="dense"
              inputRef={registerN({
                required: "入力してください",
                pattern: {
                  value: PASSWORD_REGEX,
                  message: "8文字以上、大文字・小文字英数字を含んでください",
                },
              })}
              required
              error={!!errorsN.new_password_confirm}
              defaultValue={newPassword}
              type="password"
              autoComplete="off"
            />
            <ErrorMessage
              errors={errorsN}
              name="new_password_confirm"
              render={renderErrorMessage}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
            >
              次へ
            </Button>
          </FormGroup>
        </form>
      ),
    },
    {
      label: "現在のパスワードを確認",
      content: (
        <form onSubmit={handlePasswordChange} noValidate>
          <FormGroup className={classes.formGroup}>
            <TextField
              id="current_password"
              name="current_password"
              label={"現在のパスワード"}
              margin="dense"
              inputRef={registerC({
                required: "入力してください",
              })}
              required
              error={!!errorsC.current_password}
              type="password"
              autoComplete="off"
            />
            <ErrorMessage
              errors={errorsC}
              name="current_password"
              render={renderErrorMessage}
            />
          </FormGroup>
          <FormGroup row>
            <Button
              variant="outlined"
              color="default"
              onClick={handleBack}
              size="small"
              className={classes.button}
            >
              戻る
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
            >
              変更する
            </Button>
          </FormGroup>
        </form>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onExit={() => {
        setActiveStep(0);
        setNewPassword("");
      }}
      fullWidth
    >
      <DialogContent dividers>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map(step => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>{steps[activeStep]?.content}</StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};
