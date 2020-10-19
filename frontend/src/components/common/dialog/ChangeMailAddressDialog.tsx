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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formGroup: {
      maxWidth: theme.spacing(45),
    },
    button: {
      marginTop: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
      maxWidth: theme.spacing(10),
    },
    stepperRoot: {
      padding: theme.spacing(2),
    },
  })
);

const renderErrorMessage = ({ message }: { message: string }) => (
  <Typography color="error" variant="caption">
    {message}
  </Typography>
);

export const ChangeMailAddressDialog = ({
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
    setError: setErrorN,
    handleSubmit: handleSubmitN,
  } = useForm<{
    new_mail_address: string;
  }>();
  const {
    register: registerC,
    errors: errorsC,
    handleSubmit: handleSubmitC,
    setError: setErrorC,
  } = useForm<{
    current_password: string;
  }>();

  const [newMailAddress, setNewMailAddress] = useState("");

  const handleMailAddressChange = handleSubmitC(
    async ({ current_password }) => {
      setOpenBackDrop(true);
      try {
        const user = await AuthService.reAuthenticate(
          firebaseUser?.email || "",
          current_password
        )?.then(cre => cre.user);
        await user?.updateEmail(newMailAddress);
        await user?.getIdToken(true);
        await user?.sendEmailVerification();
        onClose();
        onUpdated();
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setActiveStep(0);
            setTimeout(() => {
              setErrorN("new_mail_address", {
                message: "既に登録されているメールアドレスです",
              });
            }, 300);
            break;

          case "auth/wrong-password":
            setErrorC("current_password", {
              message: "パスワードが間違っています",
            });
            break;
          default:
            setErrorC("current_password", {
              message: "想定外の問題が発生しました",
            });
            break;
        }
        console.log(error);
      } finally {
        setOpenBackDrop(false);
      }
    }
  );

  const handleNext = handleSubmitN(({ new_mail_address }) => {
    setNewMailAddress(new_mail_address);
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  });

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const steps = [
    {
      label: "新しいメールアドレス",
      content: (
        <form onSubmit={handleNext} noValidate>
          <FormGroup className={classes.formGroup}>
            <TextField
              id="new_mail_address"
              name="new_mail_address"
              label={"新しいメールアドレス"}
              margin="dense"
              inputRef={registerN({
                required: "入力してください",
              })}
              required
              error={!!errorsN.new_mail_address}
              defaultValue={newMailAddress}
              type="email"
              autoComplete="email"
            />
            <ErrorMessage
              errors={errorsN}
              name="new_mail_address"
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
        <form onSubmit={handleMailAddressChange} noValidate>
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
        setNewMailAddress("");
      }}
      fullWidth
    >
      <DialogContent dividers>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className={classes.stepperRoot}
        >
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
