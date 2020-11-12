import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import CircleIcon from "@material-ui/icons/RadioButtonUnchecked";
import colors from "../assets/colors";
import ImageCarousel from "./ImageCarousel";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import syllable from "syllable";
import Draggable from "react-draggable";
import or from "../assets/or.png";

export default function InteractiveHaikuBuilder(props) {
  const classes = useStyles();
  const [backgroundImage, setBackgroundImage] = useState();
  const [fileInputRef, setFileInputRef] = useState();
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showFirstMarker, setShowFirstMarker] = useState(true);
  const [firstMarkerPosition, setFirstMarkerPosition] = useState({
    x: 250,
    y: 250,
  });
  const [title, setTitle] = useState({ value: null });
  const [firstLine, setFirstLine] = useState({
    value: "",
    valid: null,
    syllables: 0,
  });
  const [secondLine, setSecondLine] = useState({
    value: "",
    valid: null,
    syllables: 0,
  });
  const [thirdLine, setThirdLine] = useState({
    value: "",
    valid: null,
    syllables: 0,
  });
  const [showFirstLine, setShowFirstLine] = useState(false);

  useEffect(() => {
    let position = generateRandomMarkerPosition();
    setFirstMarkerPosition(position);
    backgroundImage ? setShowFirstMarker(true) : setShowFirstMarker(false);
  }, [backgroundImage]);

  function updatePreviewImage(file) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setBackgroundImage(`url(${fileReader.result})`);
    };
    fileReader.readAsDataURL(file);
  }

  function updatePreviewImageFromCarousel(file) {
    setBackgroundImage(`url(${file})`);
  }

  function generateRandomMarkerPosition() {
    return firstMarkerPosition;
  }

  const triggerInputFile = () => fileInputRef.click();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
          margin: "20px",
        }}
      >
        <div
          style={{
            flex: 2,
            backgroundColor: colors.maikuu0,
            height: "60%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <input
            accept="image/*"
            ref={(fileInput) => setFileInputRef(fileInput)}
            className={classes.input}
            id="image-input"
            type="file"
            style={{
              display: "none",
            }}
            onChange={(e) => {
              if (e.target.files[0]) {
                updatePreviewImage(e.target.files[0]);
              }
            }}
          />
          <label
            for="image-input"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Typography className={classes.lightHeading}>
              Pick one of your photos
            </Typography>
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "60% ",
            backgroundColor: colors.maikuu5,
          }}
        >
          <img
            src={or}
            alt="or"
            style={{
              height: "50%",
              width: "50%",
            }}
          />
        </div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            flexDirection: "row",
            flex: 2,
            height: "60% ",
            backgroundColor: colors.maikuu0,
          }}
          onClick={() => {
            setShowImageCarousel(!showImageCarousel);
          }}
        >
          <Typography className={classes.lightHeading}>
            Select one of ours for inspiration
          </Typography>
        </div>
      </div>

      {backgroundImage && (
        <div
          style={{
            margin: "20px",
            backgroundImage: backgroundImage,
            borderRadius: "10px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            flex: 6,
            boxShadow: backgroundImage
              ? "10px 10px  5px rgba(0,0,0,0.5)"
              : null,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {showFirstMarker && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Draggable>
                  <CircleIcon
                    style={{
                      color: colors.maikuu4,
                      position: "relative",
                      marginLeft: firstMarkerPosition.x,
                      marginTop: firstMarkerPosition.y,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShowFirstLine(!showFirstLine);
                    }}
                  />
                </Draggable>
                {showFirstLine && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.5",
                    }}
                  >
                    <TextField
                      className={classes.fiveLine}
                      margin="normal"
                      required
                      name="line-1"
                      type="text"
                      id="line-1"
                      helperText={`${firstLine.syllables}/5 syllable line`}
                      inputProps={{
                        autoComplete: "off",
                      }}
                      value={firstLine.value}
                      onChange={(event) => {
                        let syllables = syllable(event.target.value);
                        if (syllables !== 5) {
                          setFirstLine({
                            value: event.target.value,
                            syllables: syllables,
                            valid: false,
                          });
                        } else {
                          setFirstLine({
                            value: event.target.value,
                            syllables: syllables,
                            valid: true,
                          });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        aria-labelledby="customized-dialog-title"
        open={showImageCarousel}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: colors.maikuu5,
          }}
        >
          <IconButton
            onClick={() => setShowImageCarousel(false)}
            aria-label="close carousel"
            style={{
              width: "40px",
              alignSelf: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <CloseIcon />
          </IconButton>
          <ImageCarousel
            updatePreviewImageFromCarousel={updatePreviewImageFromCarousel}
            setShowImageCarousel={setShowImageCarousel}
          />
        </div>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: "40px",
    fontFamily: "BadScript",
    color: colors.maikuu0,
    userSelect: "none",
    textAlign: "center",
    fontSize: "30px",
    "& .MuiInputBase-input": {
      fontFamily: "BadScript",
      fontSize: "32px",
      textAlign: "center",
    },
    "& .MuiFormHelperText-root": {
      textAlign: "center",
    },
    width: "60%",
  },
  submit: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    cursor: "pointer",
  },
  labelSubmit: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
  },
  disabledSubmit: {
    backgroundColor: colors.maikuu4,
    color: colors.maikuu5,
    marginTop: "30px",
  },
  fiveLine: {
    "& .MuiInputBase-input": {
      fontFamily: "BadScript",
      fontSize: "32px",
      textAlign: "center",
      color: colors.maikuu4,
    },
    "& .MuiFormHelperText-root": {
      textAlign: "center",
      color: colors.maikuu4,
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "1px solid rgba(255, 255, 255, 1)",
    },
    width: "80%",
  },
  sevenLine: {
    "& .MuiInputBase-input": {
      fontFamily: "BadScript",
      fontSize: "32px",
      textAlign: "center",
    },
    "& .MuiFormHelperText-root": {
      textAlign: "center",
    },
    width: "100%",
  },
  heading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "26px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
  lightHeading: {
    color: colors.maikuu4,
    userSelect: "none",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  text: {
    color: colors.maikuu0,
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "rgba(0,0,0, 0.5)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  post: {
    align: "center",
    textAlign: "center",
    fontFamily: "BadScript",
    color: colors.maikuu4,
  },
  previewTitle: {
    color: colors.maikuu4,
    fontSize: 14,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}));
