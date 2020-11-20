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
import { v4 as uuidv4 } from "uuid";
import firebase from "../firebase";
import moment from "moment";

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
  const [showFirstMarker, setShowFirstMarker] = useState(true);
  const [showSecondMarker, setShowSecondMarker] = useState(true);
  const [showThirdMarker, setShowThirdMarker] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [videoBackground, setVideoBackground] = useState();
  const [uploadImage, setUploadImage] = useState();
  const [firstMarkerPosition, setFirstMarkerPosition] = useState({
    x: "0",
    y: "25px",
  });

  const [secondMarkerPosition, setSecondMarkerPosition] = useState({
    x: "0",
    y: "-50px",
  });

  const [thirdMarkerPosition, setThirdMarkerPosition] = useState({
    x: "0",
    y: "-125px",
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
  const [anon, setAnon] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [calculatedAuthor, setCalculatedAuthor] = useState();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const AnonCheckbox = withStyles({
    root: {
      color: colors.maikuu4,
      "&$checked": {
        color: colors.maikuu0,
      },
    },
  })((props) => <Checkbox color="default" {...props} />);

  useEffect(() => {
    let position = generateRandomMarkerPosition();
    setFirstMarkerPosition(position);
    backgroundImage ? setShowFirstMarker(true) : setShowFirstMarker(false);
  }, [backgroundImage]);

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
  };

  const closePreview = () => {
    setIsPreviewVisible(false);
  };

  function updatePreviewImageFromCarousel(file) {
    setUploadImage(file);
    setActiveStep("focus");
    setBackgroundImage(file);
  }

  function generateRandomMarkerPosition() {
    return firstMarkerPosition;
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
    if (firstLine.value && secondLine.value && thirdLine.value && title.value) {
      setAnchorEl(event.currentTarget);
    }
  };

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
            <div>
              {videoBackground ? (
                <video
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  controls={true}
                  width="90%"
                  autoPlay
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
                />
              )}
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
            </div>
          </Grid>

          <div
            style={{
              position: "absolute",
              marginLeft: firstMarkerPosition.x,
              marginBottom: "175px",
            }}
          >
            <Draggable>
              <div
                className="handle"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
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
              </div>
            </Draggable>
          </div>

          <div
            style={{
              position: "absolute",
              marginLeft: firstMarkerPosition.x,
              marginBottom: firstMarkerPosition.y,
            }}
          >
            {showFirstMarker && (
              <Draggable
                handle=".handle"
                onStart={() => {
                  setShowFirstLine(!showFirstLine);
                }}
              >
                <div
                  className="handle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircleIcon
                    style={{
                      color: colors.maikuu0,
                      borderRadius: "12px",
                      backgroundColor: colors.lightBlue,
                    }}
                  />
                  {showFirstLine && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
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
              </Draggable>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              marginLeft: secondMarkerPosition.x,
              marginBottom: secondMarkerPosition.y,
            }}
          >
            {showSecondMarker && (
              <Draggable
                handle=".handle"
                onStart={() => {
                  setShowSecondLine(!showSecondLine);
                }}
              >
                <div
                  className="handle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircleIcon
                    style={{
                      color: colors.maikuu0,
                      borderRadius: "12px",
                      backgroundColor: colors.lightBlue,
                    }}
                  />
                  {showSecondLine && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
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
                  )}
                </div>
              </Draggable>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              marginLeft: thirdMarkerPosition.x,
              marginBottom: thirdMarkerPosition.y,
            }}
          >
            {showThirdMarker && (
              <Draggable
                handle=".handle"
                onStart={() => {
                  setShowThirdLine(!showThirdLine);
                }}
              >
                <div
                  className="handle"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircleIcon
                    style={{
                      color: colors.maikuu0,
                      borderRadius: "12px",
                      backgroundColor: colors.lightBlue,
                    }}
                  />
                  {showThirdLine && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
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
                  )}
                </div>
              </Draggable>
            )}
          </div>

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
              <Typography style={{ color: colors.maikuu0 }}>
                {`Post Haiku with irregular syllable count? (${firstLine.syllables}, ${secondLine.syllables}, ${thirdLine.syllables})`}
              </Typography>

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
                  onClick={handleConfirmSubmit}
                >
                  <Typography>Confirm</Typography>
                </Button>
                <Button
                  classes={{
                    root: classes.lightSubmit,
                  }}
                  onClick={handleClose}
                >
                  <Typography>Cancel</Typography>
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
