import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import syllable from "syllable";
import {
  Button,
  Checkbox,
  FormControlLabel,
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
    marginTop: "30px",
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

  const handleClick = (event) => {
    if (firstLine.value && secondLine.value && thirdLine.value && title.value) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const handleSubmit = () => {
    let author = anon ? "anonymous" : user.displayName;
    firebase
      .firestore()
      .collection("posts")
      .doc()
      .set({
        id: uuidv4(),
        author: author,
        likes: 0,
        line_1: firstLine.value,
        line_2: secondLine.value,
        line_3: thirdLine.value,
        title: title.value,
        date: moment.now(),
      })
      .then(() => {
        setSuccess(true);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

  const handleConfirmSubmit = () => {
    handleClose();
    let author = anon ? "anonymous" : user.displayName;
    let id = uuidv4();
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
      })
      .then(() => {
        setSuccess(true);
        setAnon(false);
        addToAuthoredPosts(id);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
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

  if (!success) {
    return (
      <AnimatePresence>
        <motion.div
          key="not_submitted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1.0 }}
          transition={{ duration: 1.0 }}
          exit={{ opacity: 0 }}
        >
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
                height: "50vh",
                width: "90vw",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "fitContent",
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

              <Button
                id="post-button"
                type="submit"
                aria-describedby={id}
                classes={{
                  root: classes.submit,
                  disabled: classes.disabledSubmit,
                }}
                onClick={(event) => {
                  if (firstLine.valid && secondLine.valid && thirdLine.valid) {
                    handleSubmit();
                  } else {
                    handleClick(event);
                  }
                }}
              >
                <Typography>Post</Typography>
              </Button>

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
        </motion.div>
      </AnimatePresence>
    );
  }
}
