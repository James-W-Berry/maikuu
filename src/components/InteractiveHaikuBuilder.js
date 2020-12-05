import React, { useEffect, useState } from "react";
import {
  Button,
  CssBaseline,
  Dialog,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
  FormControlLabel,
  withStyles,
  Modal,
  Card,
  CardContent,
  Checkbox,
  Popover,
  ButtonBase,
  Divider,
} from "@material-ui/core";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import colors from "../assets/colors";
import ImageCarousel from "./ImageCarousel";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import syllable from "syllable";
import Draggable from "react-draggable";
import ours from "../assets/ours.png";
import yours from "../assets/yours.png";
import { v4 as uuidv4 } from "uuid";
import firebase from "../firebase";
import moment from "moment";
import Cursor from "./Cursor/Cursor";
import "../App.css";
import { motion } from "framer-motion";

export default function InteractiveHaikuBuilder(props) {
  const classes = useStyles();
  const user = props.user;
  const [userInfo, setUserInfo] = useState({});
  const [backgroundImage, setBackgroundImage] = useState();
  const [fileInputRef, setFileInputRef] = useState();
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const setActiveStep = props.setActiveStep;
  const [anchorEl, setAnchorEl] = useState(
    document.querySelector("#backgroundImageGrid")
  );
  const [videoBackground, setVideoBackground] = useState();
  const [uploadImage, setUploadImage] = useState();
  const [markers, setMarkers] = useState({
    one: { visible: "hidden", x: 0, y: 0 },
    two: { visible: "hidden", x: 0, y: 0 },
    three: { visible: "hidden", x: 0, y: 0 },
  });
  const [showTitle, setShowTitle] = useState(true);
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showThirdLine, setShowThirdLine] = useState(false);
  let doc = document.querySelector("#backgroundImageGrid");
  const placeMarkers = (newMarkers) => {
    setMarkers(newMarkers);
    console.log(newMarkers);
  };

  const [title, setTitle] = useState({ value: "untitled" });
  const [firstLine, setFirstLine] = useState({
    value: null,
    valid: null,
    syllables: 0,
  });
  const [secondLine, setSecondLine] = useState({
    value: null,
    valid: null,
    syllables: 0,
  });
  const [thirdLine, setThirdLine] = useState({
    value: null,
    valid: null,
    syllables: 0,
  });
  const [anon, setAnon] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [calculatedAuthor, setCalculatedAuthor] = useState(user.displayName);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [hint, setHint] = useState("");

  const AnonCheckbox = withStyles({
    root: {
      color: colors.maikuu4,
      "&$checked": {
        color: colors.maikuu0,
      },
    },
  })((props) => <Checkbox color="default" {...props} />);

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

  function updatePreviewImage(file) {
    setUploadImage(file);

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
    setActiveStep("focus");
  }

  const handleClose = () => {
    setAnchorEl(null);
    setShowFirstLine(false);
    setShowSecondLine(false);
    setShowThirdLine(false);
    setShowTitle(false);
  };

  const closePreview = () => {
    setIsPreviewVisible(false);
  };

  function updatePreviewImageFromCarousel(file) {
    setUploadImage(file);
    setActiveStep("focus");
    setBackgroundImage(file);
  }

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

  async function uploadPic(id) {
    if (uploadImage !== "") {
      const storageRef = firebase.storage().ref();
      const picRef = storageRef.child(`images/${id}`);
      let uploadProfilePicTask = picRef.put(uploadImage);

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
  async function handleConfirmSubmit() {
    handleClose();
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
        setIsUploading(false);
        setAnon(false);
        addToAuthoredPosts(id);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  const handleClick = (event) => {
    setIsPreviewVisible(true);
  };

  function showHint(event) {
    setAnchorEl(event.currentTarget);
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
      <Modal
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
        open={isPreviewVisible}
        onClose={closePreview}
        aria-labelledby="preview"
        aria-describedby="preview of haiku"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            width: "75vw",
            height: "75vw",
            maxHeight: "75vh",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <IconButton
              onClick={() => closePreview()}
              aria-label="close carousel"
              style={{
                backgroundColor: colors.maikuu4,
                width: "40px",
                height: "40px",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Card
            className={classes.root}
            style={{
              flex: 8,
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              width: "100%",
              height: "100%",
            }}
          >
            <CardContent className={classes.content}>
              <Typography
                color="textSecondary"
                gutterBottom
                className={classes.previewTitle}
              >
                {title.value}
              </Typography>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.post}
              >
                {firstLine.value}
              </Typography>

              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.post}
              >
                {secondLine.value}
              </Typography>

              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.post}
              >
                {thirdLine.value}
              </Typography>

              <Typography
                className={classes.previewAuthor}
                color={colors.maikuu4}
              >
                -{calculatedAuthor}
              </Typography>
            </CardContent>
          </Card>
          <div
            style={{
              display: "flex",
              flex: 2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.maikuu0,
              boxShadow: "10px 10px  5px rgba(0,0,0,0.5)",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.maikuu0,
              }}
            >
              <TextField
                className={classes.title}
                margin="normal"
                required
                name="title"
                type="text"
                id="title"
                helperText="Title"
                inputProps={{
                  autoComplete: "off",
                }}
                value={title.value}
                onChange={(event) => {
                  setTitle({ value: event.target.value });
                }}
              />
              <FormControlLabel
                control={
                  <AnonCheckbox
                    checked={anon}
                    onChange={(event) => {
                      setAnon(!anon);
                      !anon
                        ? setCalculatedAuthor("anonymous")
                        : setCalculatedAuthor(user.displayName);
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
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: colors.maikuu0,
                }}
              >
                <Typography style={{ color: colors.maikuu4 }}>
                  {`Haiku has irregular syllable count: ${firstLine.syllables}, ${secondLine.syllables}, ${thirdLine.syllables}`}
                </Typography>
              </div>
            </div>

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
                  handleSubmit();
                }}
              >
                <Typography>Post</Typography>
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {backgroundImage ? (
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
          <Cursor placeMarkers={placeMarkers} />

          <Grid
            key="userImage"
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{ width: "100%" }}
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
                    height: "40%",
                    width: "40%",
                    maxHeight: "100px",
                    maxWidth: "100px",
                  }}
                />
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
            style={{ width: "100%" }}
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
                    height: "40%",
                    width: "40%",
                    maxHeight: "100px",
                    maxWidth: "100px",
                  }}
                />
              </label>
            </div>
          </Grid>

          <Grid
            key="selected"
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              id="backgroundImageGrid"
              style={{ cursor: "none", position: "relative" }}
            >
              {videoBackground ? (
                <video
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  draggable="false"
                  controls={true}
                  width="100%"
                  autoPlay
                  loop
                >
                  <source
                    src={URL.createObjectURL(videoBackground)}
                    type="video/mp4"
                    style={{
                      padding: "0px",
                      borderRadius: "10px",
                      boxShadow: videoBackground
                        ? "10px 10px  5px rgba(0,0,0,0.5)"
                        : null,
                      maxHeight: "55vh",
                      maxWidth: "95vw",
                    }}
                  />
                </video>
              ) : (
                <img
                  src={backgroundImage}
                  alt="inspiration"
                  style={{
                    padding: "0px",
                    borderRadius: "10px",
                    boxShadow: backgroundImage
                      ? "10px 10px  5px rgba(0,0,0,0.5)"
                      : null,
                    maxHeight: "55vh",
                    maxWidth: "95vw",
                  }}
                  draggable="false"
                />
              )}

              <Draggable>
                <div
                  className="handle"
                  style={{
                    position: "absolute",
                    cursor: "none",
                    zIndex: 100,
                    left: `${markers.one.x}px`,
                    top: `${markers.one.y}px`,
                    visibility: markers.one.visible,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={classes.marker}
                    onClick={() => {
                      setShowFirstLine(!showFirstLine);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      outlineWidth: 0,
                      cursor: "none",
                    }}
                  >
                    <Typography
                      style={{ textAlign: "center", color: colors.maikuu0 }}
                    >
                      1
                    </Typography>
                  </motion.button>
                </div>
              </Draggable>

              <Popover
                open={showFirstLine}
                anchorEl={doc}
                onClose={handleClose}
                clickHandle={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  className="handle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,1.0)",
                  }}
                >
                  <TextField
                    className={classes.fiveLine}
                    margin="normal"
                    required
                    name="line-1"
                    type="text"
                    id="line-1"
                    autoFocus
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
              </Popover>

              <Draggable>
                <div
                  className="handle"
                  style={{
                    cursor: "none",
                    position: "absolute",
                    zIndex: 100,
                    left: `${markers.two.x}px`,
                    top: `${markers.two.y}px`,
                    visibility: markers.two.visible,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={classes.marker}
                    onClick={() => {
                      setShowSecondLine(!showSecondLine);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      outlineWidth: 0,
                      cursor: "none",
                    }}
                  >
                    <Typography
                      style={{ textAlign: "center", color: colors.maikuu0 }}
                    >
                      2
                    </Typography>
                  </motion.button>
                </div>
              </Draggable>

              <Popover
                open={showSecondLine}
                anchorEl={doc}
                onClose={handleClose}
                clickHandle={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  className="handle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,1.0)",
                  }}
                >
                  <TextField
                    className={classes.sevenLine}
                    margin="normal"
                    required
                    name="line-1"
                    type="text"
                    id="line-1"
                    autoFocus
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
              </Popover>

              <Draggable>
                <div
                  className="handle"
                  style={{
                    cursor: "none",
                    position: "absolute",
                    zIndex: 100,
                    left: `${markers.three.x}px`,
                    top: `${markers.three.y}px`,
                    visibility: markers.three.visible,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={classes.marker}
                    onClick={() => {
                      setShowThirdLine(!showThirdLine);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      outlineWidth: 0,
                      cursor: "none",
                    }}
                  >
                    <Typography
                      style={{ textAlign: "center", color: colors.maikuu0 }}
                    >
                      3
                    </Typography>
                  </motion.button>
                </div>
              </Draggable>

              <Popover
                open={showThirdLine}
                anchorEl={doc}
                onClose={handleClose}
                clickHandle={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  className="handle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,1.0)",
                  }}
                >
                  <TextField
                    className={classes.fiveLine}
                    margin="normal"
                    required
                    name="line-1"
                    type="text"
                    id="line-1"
                    autoFocus
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
              </Popover>
            </div>
          </Grid>

          <Grid
            key="submit"
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.maikuu0,
                boxShadow: "10px 10px  5px rgba(0,0,0,0.5)",
                borderRadius: "10px",
              }}
            >
              {/* <FormControlLabel
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
              /> */}

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
                    // if (
                    //   firstLine.valid &&
                    //   secondLine.valid &&
                    //   thirdLine.valid
                    // ) {
                    //   handleSubmit();
                    // } else {
                    if (
                      firstLine.value &&
                      secondLine.value &&
                      thirdLine.value
                    ) {
                      handleClick(event);
                    } else {
                      setHint("Complete your haiku before posting");
                      showHint(event);
                    }
                    // }
                  }}
                >
                  <Typography>Post</Typography>
                </Button>
              </div>

              {/* <div
                style={{
                  display: "flex",
                  flex: 1,
                  padding: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  id="preview-button"
                  aria-describedby={id}
                  classes={{
                    root: classes.lightSubmit,
                    disabled: classes.disabledSubmit,
                  }}
                  onClick={(event) => {
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
                    setCalculatedAuthor(author);
                    setIsPreviewVisible(true);
                  }}
                >
                  <Typography>Preview</Typography>
                </Button>
              </div>
             */}
            </div>
          </Grid>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                backgroundColor: colors.lightBlue,
              }}
            >
              <Typography style={{ color: colors.maikuu0 }}>{hint}</Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Button
                  classes={{
                    root: classes.lightSubmit,
                  }}
                  onClick={handleClose}
                >
                  <Typography>Ok</Typography>
                </Button>
              </div>
            </div>
          </Popover>
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
                htmlFor="image-input"
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
  cursor: {
    width: "40px",
    height: "40px",
    border: "2px solid #fefefe",
    borderRadius: "100%",
    position: "fixed",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    zIndex: 9999,
    mixBlendMode: "difference",
    transition: "all 150ms ease",
    transitionProperty: "opacity",
    ".cursor--hidden": {
      opacity: 0,
    },
  },
  marker: {
    color: colors.maikuu4,
    borderRadius: "17px",
    backgroundColor: colors.lightBlue,
    height: 35,
    width: 35,
    outlineWidth: 0,
  },
  title: {
    "& .MuiInputBase-input": {
      fontFamily: "BadScript",
      fontSize: "38px",
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
  lightSubmit: {
    backgroundColor: colors.maikuu4,
    color: colors.maikuu0,
    marginTop: "10px",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: colors.maikuu4,
      color: colors.maikuu0,
      opacity: "0.7",
    },
  },
  disabledLightSubmit: {
    backgroundColor: colors.maikuu5,
    color: colors.maikuu0,
    marginTop: "10px",
    marginBottom: "20px",
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
    fontSize: "24px",
    color: colors.maikuu4,
  },
  previewTitle: {
    align: "center",
    textAlign: "center",
    fontFamily: "BadScript",
    fontSize: "30px",
    color: colors.maikuu4,
  },
  previewAuthor: {
    color: colors.maikuu4,
    fontSize: "18px",
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
