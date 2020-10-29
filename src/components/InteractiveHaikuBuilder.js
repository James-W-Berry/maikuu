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

export default function InteractiveHaikuBuilder(props) {
  const user = props.user;
  const setMode = props.setMode;
  const classes = useStyles();

  return (
    <div>
      <Button
        id="change-mode-button"
        classes={{
          root: classes.submit,
        }}
        onClick={() => setMode(1)}
      >
        <Typography>Basic Mode</Typography>
      </Button>
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
