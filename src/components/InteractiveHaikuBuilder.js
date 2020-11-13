import React, { useEffect, useState } from "react";
import {
  Button,
  CssBaseline,
  Dialog,
  Divider,
  Grid,
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
import ours from "../assets/ours.png";
import yours from "../assets/yours.png";

export default function InteractiveHaikuBuilder(props) {
  const classes = useStyles();
  const [backgroundImage, setBackgroundImage] = useState();
  const [fileInputRef, setFileInputRef] = useState();
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const setActiveStep = props.setActiveStep;
  const [showFirstMarker, setShowFirstMarker] = useState(true);
  const [showSecondMarker, setShowSecondMarker] = useState(true);
  const [showThirdMarker, setShowThirdMarker] = useState(true);

  const [firstMarkerPosition, setFirstMarkerPosition] = useState({
    x: 50,
    y: 250,
  });

  const [secondMarkerPosition, setSecondMarkerPosition] = useState({
    x: 50,
    y: 350,
  });

  const [thirdMarkerPosition, setThirdMarkerPosition] = useState({
    x: 50,
    y: 450,
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
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showThirdLine, setShowThirdLine] = useState(false);

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
    setActiveStep("focus");
  }

  function updatePreviewImageFromCarousel(file) {
    setBackgroundImage(`url(${file})`);
    setActiveStep("focus");
  }

  function generateRandomMarkerPosition() {
    return firstMarkerPosition;
  }

  function triggerInputFile() {
    fileInputRef.click();
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {backgroundImage ? (
        <Grid
          container
          spacing={2}
          xl={11}
          lg={11}
          md={11}
          sm={11}
          xs={11}
          style={{
            margin: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            key="userImage"
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{ width: "100%", height: "10%" }}
          >
            <CssBaseline />
            <div
              style={{
                display: "flex",
                cursor: "pointer",
                backgroundColor: colors.lightBlue,
                justifyContent: "center",
                alignItems: "flex-start",
                borderRadius: "10px",
                flexDirection: "row",
                boxShadow: "10px 10px  5px rgba(0,0,0,0.5)",
              }}
              className={classes.gridItem}
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
                  marginBottom: "0px",
                  width: "100%",
                }}
              >
                <Typography className={classes.inspirationLabel}>
                  Pick one of your photos
                </Typography>
              </label>
            </div>
          </Grid>
          <Grid
            key="maikuuImage"
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{ width: "100%", height: "10%" }}
          >
            <CssBaseline />
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: colors.lightBlue,
                borderRadius: "10px",
                boxShadow: "10px 10px  5px rgba(0,0,0,0.5)",
              }}
              className={classes.gridItem}
              onClick={() => {
                setShowImageCarousel(!showImageCarousel);
              }}
            >
              <Typography className={classes.inspirationLabel}>
                or use one of ours
              </Typography>
            </div>
          </Grid>

          <Grid
            key="maikuuImage"
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ width: "100%", height: "90%" }}
          >
            <div
              style={{
                backgroundColor: colors.maikuu0,
                backgroundImage: backgroundImage,
                borderRadius: "10px",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                boxShadow: backgroundImage
                  ? "10px 10px  5px rgba(0,0,0,0.5)"
                  : null,
                width: "100%",
                height: "100%",
                marginTop: "15px",
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
                          position: "absolute",
                          marginLeft: firstMarkerPosition.x,
                          marginTop: firstMarkerPosition.y,
                          cursor: "pointer",
                          borderRadius: "12px",
                          backgroundColor: colors.maikuu0,
                        }}
                        onClick={() => {
                          setShowFirstLine(!showFirstLine);
                        }}
                      />
                    </Draggable>
                    {showFirstLine && (
                      <Draggable>
                        <div
                          style={{
                            marginLeft: firstMarkerPosition.x + 25,
                            marginTop: firstMarkerPosition.y,
                            position: "absolute",
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
                      </Draggable>
                    )}
                  </div>
                )}
                {showSecondMarker && (
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
                          position: "absolute",
                          marginLeft: secondMarkerPosition.x,
                          marginTop: secondMarkerPosition.y,
                          cursor: "pointer",
                          borderRadius: "12px",
                          backgroundColor: colors.maikuu0,
                        }}
                        onClick={() => {
                          setShowSecondLine(!showSecondLine);
                        }}
                      />
                    </Draggable>
                    {showSecondLine && (
                      <Draggable>
                        <div
                          style={{
                            marginLeft: secondMarkerPosition.x + 25,
                            marginTop: secondMarkerPosition.y,
                            position: "absolute",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5",
                          }}
                        >
                          <TextField
                            className={classes.sevenLine}
                            margin="normal"
                            required
                            name="line-1"
                            type="text"
                            id="line-1"
                            helperText={`${secondLine.syllables}/7 syllable line`}
                            inputProps={{
                              autoComplete: "off",
                            }}
                            value={secondLine.value}
                            onChange={(event) => {
                              let syllables = syllable(event.target.value);
                              if (syllables !== 5) {
                                setSecondLine({
                                  value: event.target.value,
                                  syllables: syllables,
                                  valid: false,
                                });
                              } else {
                                setSecondLine({
                                  value: event.target.value,
                                  syllables: syllables,
                                  valid: true,
                                });
                              }
                            }}
                          />
                        </div>
                      </Draggable>
                    )}
                  </div>
                )}
                {showThirdMarker && (
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
                          position: "absolute",
                          marginLeft: thirdMarkerPosition.x,
                          marginTop: thirdMarkerPosition.y,
                          cursor: "pointer",
                          borderRadius: "12px",
                          backgroundColor: colors.maikuu0,
                        }}
                        onClick={() => {
                          setShowThirdLine(!showThirdLine);
                        }}
                      />
                    </Draggable>
                    {showThirdLine && (
                      <Draggable>
                        <div
                          style={{
                            marginLeft: thirdMarkerPosition.x + 25,
                            marginTop: thirdMarkerPosition.y,
                            position: "absolute",
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
                            helperText={`${thirdLine.syllables}/5 syllable line`}
                            inputProps={{
                              autoComplete: "off",
                            }}
                            value={thirdLine.value}
                            onChange={(event) => {
                              let syllables = syllable(event.target.value);
                              if (syllables !== 5) {
                                setThirdLine({
                                  value: event.target.value,
                                  syllables: syllables,
                                  valid: false,
                                });
                              } else {
                                setThirdLine({
                                  value: event.target.value,
                                  syllables: syllables,
                                  valid: true,
                                });
                              }
                            }}
                          />
                        </div>
                      </Draggable>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          spacing={2}
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            key="userImage"
            item
            xs={11}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <CssBaseline />
            <div
              style={{
                display: "flex",
                cursor: "pointer",
                backgroundColor: colors.lightBlue,
                padding: "10px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                flexDirection: "row",
                boxShadow: "10px 10px  5px rgba(0,0,0,0.5)",
                width: "85%",
                height: "85%",
              }}
              className={classes.gridItem}
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
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography
                  className={classes.inspirationLabel}
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  Pick one of your photos
                </Typography>
                <img
                  src={yours}
                  alt="or"
                  style={{
                    padding: "20px",
                    height: "40%",
                    width: "40%",
                  }}
                />
              </label>
            </div>
          </Grid>
          <Grid
            key="maikuuImage"
            item
            xs={11}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CssBaseline />
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: colors.lightBlue,
                borderRadius: "10px",
                boxShadow: "10px 10px  5px rgba(0,0,0,0.5)",
                width: "85%",
                height: "85%",
              }}
              className={classes.gridItem}
              onClick={() => {
                setShowImageCarousel(!showImageCarousel);
              }}
            >
              <Typography
                className={classes.inspirationLabel}
                style={{ padding: "20px", textAlign: "center" }}
              >
                or use one of ours
              </Typography>
              <img
                src={ours}
                alt="or"
                style={{
                  padding: "20px",
                  height: "40%",
                  width: "40%",
                }}
              />
            </div>
          </Grid>
        </Grid>
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
  inspirationLabel: {
    color: colors.maikuu0,
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
  gridItem: {
    "&:hover": {
      opacity: "0.7",
    },
  },
}));
