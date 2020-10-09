import React from "react";
import { makeStyles } from "@material-ui/core";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "30px",
    marginTop: "15px",
    marginLeft: "15px",
  },
}));

export default function Collections(props) {
  const classes = useStyles();
  const user = props.user;

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
        backgroundColor: colors.maikuu5,
      }}
    >
      {user?.loggedIn ? (
        <span className={classes.title}>Collections here</span>
      ) : (
        <span className={classes.title}>Sign in to view your collections</span>
      )}
    </div>
  );
}
