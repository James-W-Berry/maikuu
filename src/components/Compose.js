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
  Container,
  FormControlLabel,
  withStyles,
} from "@material-ui/core";
import colors from "../assets/colors";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveHaikuBuilder from "./InteractiveHaikuBuilder";
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle";
import abstract_nouns from "../assets/abstract_nouns.json";
import LoopIcon from "@material-ui/icons/Loop";
import { CheckBox } from "@material-ui/icons";
import { v4 as uuidv4 } from "uuid";
import firebase from "../firebase";
import moment from "moment";

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
  lightSubmit: {
    backgroundColor: colors.maikuu4,
    color: colors.maikuu0,
    marginTop: "10px",
    marginBottom: "20px",
  },
  disabledLightSubmit: {
    backgroundColor: colors.maikuu5,
    color: colors.maikuu0,
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
    background: colors.maikuu5,
  },
}));

const AnonCheckbox = withStyles({
  root: {
    color: colors.maikuu4,
    "&$checked": {
      color: colors.maikuu0,
    },
  },
  checked: {},
})((props) => <CheckBox color="default" {...props} />);

export default function Compose(props) {
  const classes = useStyles();
  const user = props.user;
  const [userInfo, setUserInfo] = useState({});
  const [interactive, setInteractive] = useState(true);
  const [basic, setBasic] = useState(false);
  const [reflectionNoun, setReflectionNoun] = useState();
  const [loadingNewNoun, setLoadingNewNoun] = useState(true);
  const [activeStep, setActiveStep] = useState("inspiration");
  const [anon, setAnon] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState();
  const [success, setSuccess] = useState(false);
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

  useEffect(() => {
    fetchReflectionNoun();
  }, []);

  useEffect(() => {
    if (user.loggedIn) {
      const userId = firebase.auth().currentUser.uid;
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .onSnapshot(function (doc) {
          const user = doc.data();
          setUserInfo(user);
        });
    }
  }, [user]);

  const handleClick = (event) => {
    if (firstLine.value && secondLine.value && thirdLine.value && title.value) {
      setAnchorEl(event.currentTarget);
    }
  };

  async function uploadPic(id) {
    if (backgroundImage !== "") {
      const storageRef = firebase.storage().ref();
      const picRef = storageRef.child(`images/${id}`);
      let uploadProfilePicTask = picRef.put(backgroundImage);

      let promise = new Promise((resolve, reject) => {
        uploadProfilePicTask.on(
          "state_changed",
          function (snapshot) {
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          function (error) {
            console.log(error);
          },
          function () {
            uploadProfilePicTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                console.log("File available at", downloadURL);
                resolve(downloadURL);
              });
          }
        );
      });

      let downloadUrl = await promise;
      return downloadUrl;
    } else {
      return "";
    }
  }

  async function handleSubmit() {
    setIsUploading(true);
    let id = uuidv4();
    let author;

    if (anon) {
      author = "anonymous";
    } else if (user.displayName) {
      author = user.displayName;
    } else if (userInfo.displayName) {
      author = userInfo.displayName;
    } else {
      author = "unknown";
    }

    let imageUrl = await uploadPic(id);

    console.log(imageUrl);
    firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .set({
        id: id,
        author: author,
        likes: 0,
        line_1: firstLine.value,
        line_2: secondLine.value,
        line_3: thirdLine.value,
        title: title.value,
        date: moment.now(),
        image: imageUrl,
      })
      .then(() => {
        setSuccess(true);
        setAnon(false);
        addToAuthoredPosts(id);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

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

  const addToAuthoredPosts = (postId) => {
    const userId = firebase.auth().currentUser.uid;

    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .set(
        { authored: firebase.firestore.FieldValue.arrayUnion(postId) },
        { merge: true }
      )
      .then(() => {
        console.log(`Added ${postId} to authored posts`);
      })
      .catch((error) => {
        console.log(`Error adding ${postId} to authored posts`);
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
        style={{ height: "100%" }}
      >
        {user?.loggedIn ? (
          <div
            style={{ display: "flex", flexDirection: "row", height: "100%" }}
          >
            <Grid container xl={12} lg={12} md={12} spacing={2}>
              <Grid
                key="control"
                style={{
                  backgroundColor: colors.maikuu0,
                  boxShadow: "5px 5px  5px rgba(0,0,0,0.3)",
                }}
                item
                xs={12}
                sm={12}
                md={3}
                lg={3}
                xl={3}
              >
                <CssBaseline />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {basic ? (
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
                          setActiveStep("inspiration");
                          setMode(0);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px",
                          textAlign: "center",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <SwapHorizontalCircleIcon
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            color: colors.maikuu4,
                          }}
                        />

                        <Typography className={classes.lightHeading}>
                          Interactive Mode
                        </Typography>
                      </div>
                      <Divider variant="middle" className={classes.divider} />
                    </div>
                  ) : (
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
                          setActiveStep("inspiration");
                          setMode(1);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px",
                          textAlign: "center",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <SwapHorizontalCircleIcon
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            color: colors.maikuu4,
                          }}
                        />
                        <Typography className={classes.lightHeading}>
                          Basic Mode
                        </Typography>
                      </div>
                      <Divider
                        variant="middle"
                        className={classes.divider}
                        style={{ width: "100%" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "90%",
                          width: "100%",
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
                              width: "90%",
                            }}
                          >
                            <Typography
                              className={classes.lightHeading}
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
                              height: "90%",
                              width: "90%",
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
                                  height: "90%",
                                  width: "90%",
                                }}
                              >
                                <Typography
                                  className={classes.lightHeading}
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
                                  <LoopIcon style={{ color: colors.maikuu5 }} />
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
                              width: "90%",
                            }}
                          >
                            <Typography
                              className={classes.lightHeading}
                              style={{
                                fontFamily: "BadScript",
                                fontSize: "32px",
                                color: colors.maikuu0,
                              }}
                            >
                              Loading
                            </Typography>
                          </div>
                        )}
                      </div>
                      <Divider
                        variant="middle"
                        className={classes.divider}
                        style={{ width: "100%" }}
                      />
                      <AnimatePresence>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2 }}
                          style={{
                            display: "flex",
                            flexDirection: "row ",
                            width: "90%",
                          }}
                        >
                          <Typography
                            className={
                              activeStep === "inspiration"
                                ? classes.lightHeading
                                : classes.lightHeadingInactive
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Select inspiration
                          </Typography>
                        </motion.div>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          transition={{ duration: 4 }}
                          exit={{ opacity: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "90%",
                          }}
                        >
                          <Typography
                            className={
                              activeStep === "focus"
                                ? classes.lightHeading
                                : classes.lightHeadingInactive
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Focus your reflection
                          </Typography>
                        </motion.div>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          transition={{ duration: 6 }}
                          exit={{ opacity: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "90%",
                          }}
                        >
                          <Typography
                            className={
                              activeStep === "compose"
                                ? classes.lightHeading
                                : classes.lightHeadingInactive
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Compose
                          </Typography>
                        </motion.div>
                      </AnimatePresence>
                      <Divider
                        variant="middle"
                        className={classes.divider}
                        style={{ width: "100%" }}
                      />
                      <AnimatePresence>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2 }}
                          style={{
                            display: "flex",
                            flexDirection: "column ",
                            width: "90%",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <AnonCheckbox
                                checked={anon}
                                onChange={(event) => {
                                  setAnon(!anon);
                                }}
                                name="checkedG"
                              />
                            }
                            label="Post Anonymously"
                            className={classes.lightHeading}
                          />

                          <div
                            style={{
                              display: "flex",
                              flex: 1,
                              padding: "10px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              id="post-button"
                              type="submit"
                              classes={{
                                root: classes.lightSubmit,
                                disabled: classes.disabledLightSubmit,
                              }}
                              onClick={(event) => {
                                if (
                                  firstLine.valid &&
                                  secondLine.valid &&
                                  thirdLine.valid
                                ) {
                                  handleSubmit();
                                } else {
                                  handleClick(event);
                                }
                              }}
                            >
                              <Typography>Post</Typography>
                            </Button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid key="write" item xs={12} sm={12} md={9} lg={9} xl={9}>
                <CssBaseline />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {basic && (
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
                          setActiveStep={setActiveStep}
                          setFirstLine={setFirstLine}
                          setSecondLine={setSecondLine}
                          setThirdLine={setThirdLine}
                          setParentBackgroundImage={setBackgroundImage}
                          setParentTitle={setTitle}
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <Container component="main" xl={12} lg={12} md={12}>
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
        )}
      </motion.div>
    </AnimatePresence>
  );
}
