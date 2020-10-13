import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  Theme,
  Backdrop,
  CircularProgress,
  Container,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";
import getCroppedImg from "utils/helper/cropImage";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

type State = {
  open: boolean;
  setOpen: (open: boolean) => any;
  imgUrl: string;
  aspect: number;
  onCompleted: (cropedImage: string) => any;
  onClose: () => any;
};

const useStyles = makeStyles((theme: Theme) => ({
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    background: "#333",
    [theme.breakpoints.up("sm")]: {
      height: 400,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  sliderLabel: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: "22px 0px",
    marginLeft: 16,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
      margin: "0 16px",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const CropDialog: React.FC<State> = ({
  open,
  setOpen,
  onCompleted,
  onClose,
  imgUrl,
  aspect,
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [openBackDrop, setOpenBackDrop] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      setOpenBackDrop(true);
      const croppedImage = await getCroppedImg(
        imgUrl,
        croppedAreaPixels,
        rotation
      );
      setOpenBackDrop(false);
      setOpen(false);
      onCompleted(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, imgUrl, onCompleted, setOpen]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      aria-labelledby="crop-dialog-title"
      aria-describedby="crop-dialog-description"
    >
      <Container maxWidth="md">
        <DialogTitle id="crop-dialog-title">範囲を選択してください</DialogTitle>
        <DialogContent>
          <div className={classes.cropContainer}>
            <Cropper
              image={imgUrl}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={classes.controls}>
            <div className={classes.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: classes.sliderLabel }}
              >
                拡大
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                className={classes.slider}
                onChange={(_e, zoom) => {
                  if (!Array.isArray(zoom)) {
                    setZoom(zoom);
                  }
                }}
              />
            </div>
            <div className={classes.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: classes.sliderLabel }}
              >
                回転
              </Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={90}
                aria-labelledby="Rotation"
                className={classes.slider}
                onChange={(_e, rotation) => {
                  if (!Array.isArray(rotation)) {
                    setRotation(rotation);
                  }
                }}
              />
            </div>
          </div>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              startIcon={<CancelIcon />}
              color="secondary"
            >
              キャンセル
            </Button>
            <Button
              onClick={showCroppedImage}
              variant="outlined"
              color="primary"
              startIcon={<CheckIcon />}
            >
              決定
            </Button>
          </DialogActions>
        </DialogContent>
        <Backdrop className={classes.backdrop} open={openBackDrop}>
          <CircularProgress />
        </Backdrop>
      </Container>
    </Dialog>
  );
};

export default CropDialog;
