import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import syllable from "syllable";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  submit: {
    backgroundColor: colors.maikuu4,
    color: colors.maikuu0,
    marginTop: "30px",
  },
  disabledSubmit: {
    backgroundColor: colors.maikuu3,
    color: colors.maikuu0,
    marginTop: "30px",
  },
  fiveLine: {
    "& .MuiInputBase-input": {
      fontFamily: "BadScript",
      fontSize: "32px",
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
    width: "100%",
  },
}));

export default function HaikuBuilder() {
  const [firstLine, setFirstLine] = useState({ value: "", valid: null });
  const [secondLine, setSecondLine] = useState({ value: "", valid: null });
  const [thirdLine, setThirdLine] = useState({ value: "", valid: null });
  const classes = useStyles();

  const submitHaiku = () => {
    console.log(
      `${firstLine.value} \n${secondLine.value} \n${thirdLine.value}`
    );
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
          width: "100vw",
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
            className={classes.fiveLine}
            margin="normal"
            required
            name="line-1"
            type="text"
            id="line-1"
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
          <Typography>Submit</Typography>
        </Button>
      </form>
    </div>
  );
}
