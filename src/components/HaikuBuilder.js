import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import syllable from "syllable";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Modal,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import colors from "../assets/colors";
import firebase from "../firebase";
import moment from "moment";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import checkAnim from "../assets/check-animation.json";
import { NavLink } from "react-router-dom";
import Lottie from "react-lottie";
import Popover from "@material-ui/core/Popover";
import { v4 as uuidv4 } from "uuid";
import PuffLoader from "react-spinners/PuffLoader";
import ImageIcon from "@material-ui/icons/Image";
import line from "../assets/line.png";

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
    },
    "& .MuiFormHelperText-root": {
      textAlign: "center",
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
    fontSize: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
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
}));

const AnonCheckbox = withStyles({
  root: {
    color: colors.maikuu4,
    "&$checked": {
      color: colors.maikuu0,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function HaikuBuilder(props) {
  const user = props.user;
  const setMode = props.setMode;
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
  const [anon, setAnon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [calculatedAuthor, setCalculatedAuthor] = useState();

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closePreview = () => {
    setIsPreviewVisible(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const classes = useStyles();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: checkAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  async function uploadPic(id) {
    if (image !== "") {
      const storageRef = firebase.storage().ref();
      const profilePicRef = storageRef.child(`images/${id}`);
      let uploadProfilePicTask = profilePicRef.put(image);

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

  function updatePreviewImage(file) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setBackgroundImage(`url(${fileReader.result})`);
    };
    fileReader.readAsDataURL(file);
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

  if (success) {
    return (
      <div>
        <Lottie options={defaultOptions} height={300} width={300} />
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

  if (!success && !isUploading) {
    return (
      <div style={{ marginTop: "30px" }}>
        <Modal
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={isPreviewVisible}
          onClose={closePreview}
          aria-labelledby="preview"
          aria-describedby="preview of haiku"
        >
          <div
            style={{
              backgroundColor: colors.maikuu5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Card
              className={classes.root}
              style={{
                backgroundImage: backgroundImage,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }}
            >
              <CardContent className={classes.content}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  className={classes.post}
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
                  className={classes.previewTitle}
                  color={colors.maikuu4}
                >
                  -{calculatedAuthor}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Modal>
        <div id="haiku-builder">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
              width: "90%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                className={classes.sevenLine}
                margin="normal"
                required
                name="line-2"
                type="text"
                id="line-2"
                helperText={`${secondLine.syllables}/7 syllable line`}
                inputProps={{
                  autoComplete: "off",
                }}
                value={secondLine.value}
                onChange={(event) => {
                  let syllables = syllable(event.target.value);
                  if (syllables !== 7) {
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <TextField
                className={classes.fiveLine}
                margin="normal"
                required
                name="line-3"
                type="text"
                id="line-3"
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

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "80%",
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
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <input
                  accept="image/*"
                  className={classes.input}
                  id="image-input"
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setImage(e.target.files[0]);
                      updatePreviewImage(e.target.files[0]);
                    }
                  }}
                />
                {image === "" ? (
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
                    <ImageIcon style={{ color: colors.maikuu0 }} />
                    <Typography style={{ marginLeft: "10px" }}>
                      Add image
                    </Typography>
                  </label>
                ) : (
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
                    <img
                      width="100px"
                      height="100px"
                      style={{ borderRadius: "5px" }}
                      src={URL.createObjectURL(image)}
                      alt="post"
                    />
                    <Typography style={{ marginLeft: "10px" }}>
                      Add image
                    </Typography>
                  </label>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "80%",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
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
                    root: classes.submit,
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
                {/* <img
                  src={line}
                  alt="break"
                  style={{
                    width: "30px",
                    height: "100px",
                  }}
                /> */}
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
                    root: classes.submit,
                    disabled: classes.disabledSubmit,
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
                {/* <img
                  src={line}
                  alt="break"
                  style={{
                    width: "30px",
                    height: "100px",
                  }}
                /> */}
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
                  id="change-mode-button"
                  classes={{
                    root: classes.submit,
                  }}
                  onClick={() => setMode(0)}
                >
                  <Typography>Interactive Mode</Typography>
                </Button>
              </div>
            </div>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
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
                }}
              >
                <Typography className={classes.typography}>
                  {`Post Haiku with irregular syllable count? (${firstLine.syllables}, ${secondLine.syllables}, ${thirdLine.syllables})`}
                </Typography>

                <Button
                  classes={{
                    root: classes.submit,
                  }}
                  onClick={handleConfirmSubmit}
                >
                  <Typography>Confirm</Typography>
                </Button>
              </div>
            </Popover>
          </form>
        </div>
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
}
