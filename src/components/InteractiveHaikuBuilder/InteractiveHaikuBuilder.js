import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  FormControlLabel,
  withStyles,
  Card,
  CardContent,
  Checkbox,
  Popover,
  Dialog,
  TextField,
  IconButton,
} from "@material-ui/core";
import colors from "../../assets/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import syllable from "syllable";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../firebase";
import moment from "moment";
import Cursor from "../Cursor/Cursor";
import "../../App.css";
import { motion } from "framer-motion";
import "./InteractiveHaikuBuilder.css";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import OnboardingCarousel from "../OnboardingCarousel";
import Lottie from "react-lottie";
import checkAnim from "../../assets/check-animation.json";
import { NavLink } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";

export default function InteractiveHaikuBuilder(props) {
  const classes = useStyles();
  const user = props.user;
  const [userInfo, setUserInfo] = useState({});
  const [backgroundImage, setBackgroundImage] = useState(props.backgroundImage);
  const theme = useTheme();
  const largerThanSm = useMediaQuery(theme.breakpoints.between("md", "xl"));
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(
    document.querySelector("#backgroundImageGrid")
  );
  const [videoBackground, setVideoBackground] = useState(props.videoBackground);
  const [uploadImage, setUploadImage] = useState(props.uploadImage);
  const [concept, setConcept] = useState("");
  const [markers, setMarkers] = useState({
    one: { visible: "visible", x: "25%", y: "25%" },
    two: { visible: "visible", x: "50%", y: "50%" },
    three: { visible: "visible", x: "75%", y: "75%" },
  });
  const [showTitle, setShowTitle] = useState(true);
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showThirdLine, setShowThirdLine] = useState(false);
  const [title, setTitle] = useState({ value: "" });
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
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [calculatedAuthor, setCalculatedAuthor] = useState(user.displayName);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [hint, setHint] = useState("");
  const [showFirstTimeHelp, setShowFirstTimeHelp] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: checkAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const AnonCheckbox = withStyles({
    root: {
      color: colors.maikuu4,
      "&$checked": {
        color: colors.maikuu0,
      },
    },
  })((props) => <Checkbox color="default" {...props} />);

  useEffect(() => {
    if (!window.localStorage) {
      console.log(
        "no localStorage API found - will not show hints for new user"
      );
    } else {
      if (!window.localStorage.isReturningVisitor) {
        window.localStorage.isReturningVisitor = true;
        setShowFirstTimeHelp(true);
      }
    }
  }, []);

  useEffect(() => {
    setBackgroundImage(props.backgroundImage);
    setVideoBackground(props.videoBackground);
    setUploadImage(props.uploadImage);
    setConcept(props.concept);
  }, [
    props.backgroundImage,
    props.videoBackground,
    props.uploadImage,
    props.concept,
  ]);

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
    if (uploadImage) {
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

  async function getTemplateImageUrl(id) {
    switch (id) {
      case "inspiration_1":
        return "https://firebasestorage.googleapis.com/v0/b/maikuu-c3715.appspot.com/o/images%2Finspiration_1.jpeg?alt=media&token=7e7f9295-1d64-486d-9d99-0b36a10c0b88";
      case "inspiration_2":
        return "https://firebasestorage.googleapis.com/v0/b/maikuu-c3715.appspot.com/o/images%2Finspiration_2.jpeg?alt=media&token=b9924486-e292-44bb-8e3f-f08e7d2d8d30";
      case "inspiration_3":
        return "https://firebasestorage.googleapis.com/v0/b/maikuu-c3715.appspot.com/o/images%2Finspiration_3.jpeg?alt=media&token=7bca8c0c-5e87-4293-b942-95d67d3e7de7";
      case "inspiration_4":
        return "https://firebasestorage.googleapis.com/v0/b/maikuu-c3715.appspot.com/o/images%2Finspiration_4.jpeg?alt=media&token=bd6952eb-a0f7-45e2-a498-0aaf33c43485";
      default:
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

    let imageUrl;

    if (uploadImage.includes("inspiration_")) {
      imageUrl = await getTemplateImageUrl(uploadImage);
    } else {
      imageUrl = await uploadPic(id);
    }

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
        concept: concept,
        markers: markers,
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
  const imageContainer = document.querySelector("#backgroundImageGrid");

  const onDragStop = (e, position, marker) => {
    let newMarkers = markers;
    switch (marker) {
      case "one":
        markers.one.x = `${
          25 + (position.x / imageContainer.clientWidth) * 100
        }%`;
        markers.one.y = `${
          25 + (position.y / imageContainer.clientHeight) * 100
        }%`;
        break;
      case "two":
        markers.two.x = `${
          50 + (position.x / imageContainer.clientWidth) * 100
        }%`;
        markers.two.y = `${
          50 + (position.y / imageContainer.clientHeight) * 100
        }%`;
        break;
      case "three":
        markers.three.x = `${
          75 + (position.x / imageContainer.clientWidth) * 100
        }%`;
        markers.three.y = `${
          75 + (position.y / imageContainer.clientHeight) * 100
        }%`;
        break;
      default:
        break;
    }
    setMarkers(newMarkers);
  };

  if (success) {
    return (
      <div>
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
          isClickToPauseDisabled={true}
        />
        <Typography
          onClick={() => {
            setSuccess(false);
            setTitle({ value: null });
            setFirstLine({ value: "", valid: null, syllables: 0 });
            setSecondLine({ value: "", valid: null, syllables: 0 });
            setThirdLine({ value: "", valid: null, syllables: 0 });
          }}
          className={classes.text}
        >
          Compose another haiku
        </Typography>
        <NavLink
          style={{
            textDecoration: "none",
          }}
          to="/feed"
        >
          <Typography className={classes.text}>Return to feed</Typography>
        </NavLink>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div
        style={{
          height: "70vh",
          display: "flex",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.heading}>Posting your haiku</Typography>
        <PuffLoader color={"#A0C4F2"} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      <Dialog
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
        open={isPreviewVisible}
        onClose={closePreview}
        fullScreen
        fullWidth
        aria-labelledby="preview"
        aria-describedby="preview of haiku"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            width: "100vw",
            height: "100vh",
            flexDirection: "column",
            backgroundColor: colors.maikuu0,
          }}
        >
          <Typography style={{ color: colors.maikuu4, fontSize: "30px" }}>
            Preview
          </Typography>
          <Card
            className={classes.root}
            style={{
              flex: 8,
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              width: "75vw",
              height: "75vw",
              minHeight: "50vh",
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
              width: "90%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                className={classes.title}
                margin="normal"
                name="title"
                type="text"
                id="title"
                inputProps={{
                  autoComplete: "off",
                }}
                label="Title your haiku"
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
                  {`Haiku has syllable count: ${firstLine.syllables}, ${secondLine.syllables}, ${thirdLine.syllables}`}
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
                  handleConfirmSubmit();
                }}
                style={{ marginRight: "10px" }}
              >
                <Typography>Post</Typography>
              </Button>
              <Button
                id="post-button"
                type="submit"
                classes={{
                  root: classes.lightSubmit,
                  disabled: classes.disabledLightSubmit,
                }}
                onClick={(event) => {
                  closePreview();
                }}
                style={{ marginLeft: "10px" }}
              >
                <Typography>Cancel</Typography>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {backgroundImage && (
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
            flexDirection: "row",
          }}
        >
          <Cursor />
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
              style={{
                cursor: "none",
                position: "relative",
                backgroundColor: "rgba(0,0,0,0.8)",
              }}
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
                    backgroundColor: "rgba(0,0,0,0)",
                    boxShadow: backgroundImage
                      ? "10px 10px  5px rgba(0,0,0,0.5)"
                      : null,
                    maxHeight: "90vh",
                    maxWidth: "95vw",
                  }}
                  draggable="false"
                />
              )}

              <Draggable
                onStop={(e, position) => {
                  onDragStop(e, position, "one");
                }}
              >
                <div
                  className="handle"
                  style={{
                    position: "absolute",
                    cursor: "none",
                    zIndex: 100,
                    left: "25%",
                    top: "25%",
                    visibility: markers.one.visible,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={classes.marker}
                    onTap={() => {
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
                anchorEl={imageContainer}
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
                PaperProps={{ style: { width: largerThanSm ? "50%" : "100%" } }}
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
                    helperText={`First line - ${firstLine.syllables}/5 syllables`}
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

              <Draggable
                onStop={(e, position) => {
                  onDragStop(e, position, "two");
                }}
              >
                <div
                  className="handle"
                  style={{
                    cursor: "none",
                    position: "absolute",
                    zIndex: 100,
                    left: "50%",
                    top: "50%",
                    visibility: markers.two.visible,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={classes.marker}
                    onTap={() => {
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
                anchorEl={imageContainer}
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
                PaperProps={{ style: { width: largerThanSm ? "50%" : "100%" } }}
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
                    helperText={`Second line - ${secondLine.syllables}/7 syllables`}
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

              <Draggable
                onStop={(e, position) => {
                  onDragStop(e, position, "three");
                }}
              >
                <div
                  className="handle"
                  style={{
                    cursor: "none",
                    position: "absolute",
                    zIndex: 100,
                    left: "75%",
                    top: "75%",
                    visibility: markers.three.visible,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={classes.marker}
                    onTap={() => {
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
                anchorEl={imageContainer}
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
                PaperProps={{ style: { width: largerThanSm ? "50%" : "100%" } }}
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
                    helperText={`Third line ${thirdLine.syllables}/5 syllables`}
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
          <Tooltip
            title={
              firstLine.value && secondLine.value && thirdLine.value
                ? ""
                : "Complete your haiku before posting"
            }
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                padding: "10px",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 0,
              }}
            >
              <Button
                id="post-button"
                type="submit"
                disabled={
                  !(firstLine.value && secondLine.value && thirdLine.value)
                }
                classes={{
                  root: classes.lightSubmit,
                  disabled: classes.disabledLightSubmit,
                }}
                onClick={(event) => {
                  if (firstLine.value && secondLine.value && thirdLine.value) {
                    handleClick(event);
                  } else {
                    setHint("Complete your haiku before posting");
                    showHint(event);
                  }
                }}
              >
                <Typography>Post</Typography>
              </Button>
            </div>
          </Tooltip>
        </Grid>
      )}

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        aria-labelledby="customized-dialog-title"
        open={showFirstTimeHelp}
        PaperProps={{ style: { backgroundColor: colors.maikuu0 } }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            backgroundColor: colors.maikuu0,
            borderBottom: `1px solid ${colors.maikuu4}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div style={{ flex: 10 }}>
              <Typography
                className={classes.lightHeading}
                style={{ justifyContent: "flex-start", alignItems: "center" }}
              >
                First time tips
              </Typography>
            </div>

            <div style={{ flex: 1 }}>
              <IconButton
                onClick={() => setShowFirstTimeHelp(false)}
                aria-label="close carousel"
                style={{
                  width: "40px",
                  alignSelf: "flex-end",
                  justifyContent: "flex-end",
                  color: colors.maikuu4,
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <OnboardingCarousel />
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
      borderBottomColor: colors.maikuu4,
    },
    width: "80%",
    "& label ": {
      color: colors.maikuu4,
    },
    "& label.Mui-focused": {
      color: colors.maikuu4,
    },
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
    "&:hover": {
      backgroundColor: colors.maikuu4,
      color: colors.maikuu0,
      opacity: "0.7",
    },
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
    width: "90%",
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
    width: "90%",
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
  heading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
}));
