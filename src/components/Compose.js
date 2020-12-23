import React, { useState, useEffect } from "react";
import HaikuBuilder from "./HaikuBuilder";
import {
  Button,
  makeStyles,
  Typography,
  CssBaseline,
  Grid,
  IconButton,
  Divider,
  Dialog,
  Container,
} from "@material-ui/core";
import colors from "../assets/colors";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveHaikuBuilder from "./InteractiveHaikuBuilder/InteractiveHaikuBuilder";
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle";
import abstract_nouns from "../assets/abstract_nouns.json";
import LoopIcon from "@material-ui/icons/Loop";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import yours from "../assets/yours.png";
import ours from "../assets/ours.png";
import CloseIcon from "@material-ui/icons/Close";
import ImageCarousel from "./ImageCarousel";

export default function Compose(props) {
  const classes = useStyles();
  const user = props.user;
  const [interactive, setInteractive] = useState(true);
  const [basic, setBasic] = useState(false);
  const [reflectionNoun, setReflectionNoun] = useState();
  const [loadingNewNoun, setLoadingNewNoun] = useState(true);
  const theme = useTheme();
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const [fileInputRef, setFileInputRef] = useState();
  const [uploadImage, setUploadImage] = useState();
  const [videoBackground, setVideoBackground] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchReflectionNoun();
  }, []);

  const fetchReflectionNoun = () => {
    const max = Object.entries(abstract_nouns).length;
    const randomIndex = Math.floor(Math.random() * (max - 0 + 1));
    const randomAbstractNoun = abstract_nouns[randomIndex];
    setReflectionNoun(randomAbstractNoun);
    setLoadingNewNoun(false);
  };

  const setMode = (mode) => {
    if (mode === 0) {
      setInteractive(true);
      setBasic(false);
    } else {
      setInteractive(false);
      setBasic(true);
    }
  };

  async function updatePreviewImageFromCarousel(file) {
    const blob = new File([file], "inspiration.jpeg");
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result);
      setUploadImage(blob);
      setBackgroundImage(file);
    };
    fileReader.readAsDataURL(blob);
  }

  function updatePreviewImage(file) {
    setUploadImage(file);
    console.log(file);

    const fileReader = new FileReader();

    if (file.name.includes(".mp4")) {
      setVideoBackground(file);
    } else {
      setVideoBackground(null);
    }

    fileReader.onload = () => {
      setBackgroundImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  if (user.loggedIn && basic) {
    return (
      <AnimatePresence>
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.0, 1.0] }}
          exit={{ opacity: 0 }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
              <Grid
                key="control"
                style={{
                  boxShadow: "5px 5px  5px rgba(0,0,0,0.3)",
                }}
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <CssBaseline />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "90%",
                    }}
                  >
                    <div
                      onClick={() => {
                        setMode(0);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <SwapHorizontalCircleIcon
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          color: colors.maikuu0,
                        }}
                      />

                      <Typography className={classes.controlHeading}>
                        Interactive Mode
                      </Typography>
                    </div>
                    <Divider variant="middle" className={classes.divider} />
                  </div>
                </div>
              </Grid>
              <Grid key="write" item xs={12} sm={12} md={12} lg={12} xl={12}>
                <CssBaseline />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    paddingTop: "10px",
                  }}
                >
                  <AnimatePresence>
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.0, 1.0] }}
                      exit={{ opacity: 0 }}
                      style={{ height: "90%", width: "90%" }}
                    >
                      <HaikuBuilder user={user} setMode={setMode} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Grid>
            </Grid>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  } else if (user.loggedIn && !basic) {
    return (
      <AnimatePresence>
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.0, 1.0] }}
          exit={{ opacity: 0 }}
        >
          <Grid
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Grid
              key="control"
              style={{
                display: "flex",
                flexDirection: "row",
              }}
              container
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
            >
              <Grid
                key="modeControl"
                style={{
                  boxShadow: "5px 5px 5px rgba(0,0,0,0.3)",
                  width: "100%",
                }}
                item
                xs={12}
                sm={12}
                md={3}
                lg={3}
                xl={3}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <div
                    onClick={() => {
                      setMode(1);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <SwapHorizontalCircleIcon
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        color: colors.maikuu0,
                      }}
                    />
                    <Typography className={classes.controlHeading}>
                      Switch to Basic Mode
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid
                key="nounControl"
                style={{
                  boxShadow: "5px 5px 5px rgba(0,0,0,0.3)",
                  width: "100%",
                }}
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <AnimatePresence>
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.0, 1.0] }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        className={classes.controlHeading}
                        style={{ display: "flex" }}
                      >
                        Reflect on
                      </Typography>
                    </motion.div>
                  </AnimatePresence>
                  {!loadingNewNoun ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <AnimatePresence>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          transition={{ duration: 2 }}
                          exit={{ opacity: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Typography
                            className={classes.controlHeading}
                            style={{
                              fontFamily: "BadScript",
                              fontSize: "32px",
                            }}
                          >
                            {reflectionNoun}
                          </Typography>
                          <IconButton
                            onClick={() => {
                              setLoadingNewNoun(true);
                              setTimeout(() => {
                                fetchReflectionNoun();
                              }, 500);
                            }}
                            aria-label="new reflection"
                            style={{ outline: "none" }}
                          >
                            <LoopIcon style={{ color: colors.maikuu0 }} />
                          </IconButton>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        height: "90%",
                      }}
                    >
                      <Typography
                        className={classes.lightHeading}
                        style={{
                          fontFamily: "BadScript",
                          fontSize: "32px",
                          color: colors.maikuu5,
                        }}
                      >
                        Loading
                      </Typography>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid
                key="imageControl"
                style={{
                  boxShadow: "5px 5px 5px rgba(0,0,0,0.3)",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
                item
                xs={12}
                sm={12}
                md={3}
                lg={3}
                xl={3}
              >
                <div
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  className={classes.gridItem}
                >
                  <input
                    accept="image/*|video/*"
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
                    <img
                      src={yours}
                      alt="or"
                      style={{
                        padding: "5px",
                        height: "65px",
                        width: "75px",
                      }}
                    />
                  </label>
                  <Typography style={{ fontSize: "14px" }}>
                    Pick your image
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                  className={classes.gridItem}
                  onClick={() => {
                    setShowImageCarousel(!showImageCarousel);
                  }}
                >
                  <label
                    for="holder"
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
                    <img
                      src={ours}
                      alt="or"
                      style={{
                        padding: "5px",
                        height: "65px",
                        width: "75px",
                      }}
                    />
                  </label>
                  <Typography style={{ fontSize: "14px" }}>
                    Use a sample
                  </Typography>
                </div>
              </Grid>
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
                    updatePreviewImageFromCarousel={
                      updatePreviewImageFromCarousel
                    }
                    setShowImageCarousel={setShowImageCarousel}
                  />
                </div>
              </Dialog>
            </Grid>
            <Grid key="write" item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CssBaseline />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                  paddingTop: "10px",
                }}
              >
                {basic && (
                  <AnimatePresence>
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.0, 1.0] }}
                      exit={{ opacity: 0 }}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <HaikuBuilder user={user} setMode={setMode} />
                    </motion.div>
                  </AnimatePresence>
                )}
                {interactive && (
                  <AnimatePresence>
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.0, 1.0] }}
                      exit={{ opacity: 0 }}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <InteractiveHaikuBuilder
                        user={user}
                        setMode={setMode}
                        backgroundImage={backgroundImage}
                        videoBackground={videoBackground}
                        uploadImage={uploadImage}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </Grid>
          </Grid>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence>
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.0, 1.0] }}
          exit={{ opacity: 0 }}
        >
          <Container component="main" xl={12} lg={12} md={12} sm={12} xs={12}>
            <CssBaseline />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
              }}
            >
              <Typography className={classes.heading}>
                Sign in to compose a haiku
              </Typography>
              <NavLink
                to="/signin"
                style={{
                  color: colors.maikuu0,
                  textDecoration: "none",
                }}
              >
                <Button
                  classes={{
                    root: classes.submit,
                  }}
                >
                  <Typography>Sign In</Typography>
                </Button>
              </NavLink>
            </div>
          </Container>
        </motion.div>
      </AnimatePresence>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "30px",
    marginTop: "15px",
    marginLeft: "15px",
  },
  heading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "24px",
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
  controlHeading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  lightControlHeading: {
    color: colors.maikuu4,
    userSelect: "none",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  lightHeadingInactive: {
    color: colors.maikuu4,
    opacity: "0.5",
    userSelect: "none",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  submit: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    marginTop: "10px",
    marginBottom: "20px",
  },
  signin: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    marginTop: "10px",
    marginBottom: "20px",
  },
  divider: {
    background: colors.maikuu0,
  },
}));
