import React from "react";
import HaikuBuilder from "./HaikuBuilder";
import { makeStyles } from "@material-ui/core";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: colors.maikuu4,
    userSelect: "none",
    fontSize: "30px",
    marginTop: "15px",
    marginLeft: "15px",
  },
}));

export default function FeedPost() {
  const classes = useStyles();

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "85vh",
        backgroundColor: colors.maikuu2,
      }}
    >
      <span className={classes.title}>Compose a Haiku</span>
      <HaikuBuilder />
    </div>
  );
}
