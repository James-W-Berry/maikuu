import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import syllable from "syllable";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../assets/colors";
import firebase from "../firebase";

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
}));

export default function HaikuBuilder() {
  const [title, setTitle] = useState({ value: "" });
  const [firstLine, setFirstLine] = useState({ value: "", valid: null });
  const [secondLine, setSecondLine] = useState({ value: "", valid: null });
  const [thirdLine, setThirdLine] = useState({ value: "", valid: null });
  const classes = useStyles();

  const submitHaiku = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc()
      .set({
        author: "anonymous",
        likes: 0,
        line_1: firstLine.value,
        line_2: secondLine.value,
        line_3: thirdLine.value,
        title: title,
      })
      // .then({//show some animation or success message})
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

  return (
    <div id="haiku-builder">
      <form
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
              setTitle(event.target.value);
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
            helperText="5 syllable line"
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
          <Typography style={{ alignSelf: "center" }}>
            {firstLine.syllables}
          </Typography>
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
            helperText="7 syllable line"
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
          <Typography style={{ alignSelf: "center" }}>
            {secondLine.syllables}
          </Typography>
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
            helperText="5 syllable line"
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
          <Typography style={{ alignSelf: "center" }}>
            {thirdLine.syllables}
          </Typography>
        </div>

        <Button
          classes={{ root: classes.submit, disabled: classes.disabledSubmit }}
          disabled={!(firstLine.valid && secondLine.valid && thirdLine.valid)}
          onClick={submitHaiku}
        >
          <Typography>Post</Typography>
        </Button>
      </form>
    </div>
  );
}
