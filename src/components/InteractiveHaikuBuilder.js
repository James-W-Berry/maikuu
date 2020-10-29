import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import syllable from "syllable";
import { Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import abstract_nouns from "../assets/abstract_nouns.json";
import colors from "../assets/colors";
import { AnimatePresence, motion } from "framer-motion";

export default function InteractiveHaikuBuilder(props) {
  const user = props.user;
  const setMode = props.setMode;
  const classes = useStyles();
  const [reflectionNoun, setReflectionNoun] = useState();
  const [loadingNewNoun, setLoadingNewNoun] = useState(true);
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        width: "90vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!loadingNewNoun && (
          <AnimatePresence>
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.0, 1.0] }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Typography
                className={classes.heading}
                style={{ display: "flex", marginRight: "20px" }}
              >
                Reflect on
              </Typography>
            </motion.div>
          </AnimatePresence>
        )}
        {!loadingNewNoun && (
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
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <Typography
                  className={classes.heading}
                  style={{ fontFamily: "BadScript" }}
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
                >
                  <LoopIcon style={{ color: colors.maikuu2 }} />
                </IconButton>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
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
    fontSize: "26px",
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
