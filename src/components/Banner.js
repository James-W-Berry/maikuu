import React, { useState } from "react";
import colors from "../assets/colors";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import logo from "../assets/logo_blue.png";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    top: 0,
    minHeight: "80px",
    backgroundColor: colors.maikuu3,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily: "BadScript",
    color: "#f7f7f5",
    flexGrow: 1,
  },
  appbar: {
    background: colors.maikuu0,
  },
}));

const useNavStyles = makeStyles((theme) => ({
  selected: {
    "& .MuiBottomNavigationAction-label": {
      color: colors.maikuu4,
      outline: "none !important",
    },
  },
  root: {
    color: colors.maikuu5,
    outline: "none !important",
  },
}));

export default function Banner(props) {
  const classes = useStyles();
  const navClasses = useNavStyles();
  const history = useHistory();
  const [value, setValue] = useState(0);

  return (
    <div className="root" style={{ zIndex: "1" }}>
      <BottomNavigation
        style={{ justifyContent: "space-evenly", alignItems: "center" }}
        value={value}
        showLabels
        className={classes.stickToBottom}
      >
        <BottomNavigationAction
          showLabel
          label="Feed"
          classes={navClasses}
          onClick={() => {
            setValue(0);
            history.push("/feed");
          }}
        />

        <BottomNavigationAction
          showLabel
          classes={navClasses}
          label="Profile"
          onClick={() => {
            setValue(1);
            history.push("/profile");
          }}
        />

        <img
          src={logo}
          alt="Logo"
          style={{
            height: "60px",
            width: "60px",
            cursor: "pointer",
          }}
        />

        <BottomNavigationAction
          showLabel
          classes={navClasses}
          label="Compose"
          onClick={() => {
            setValue(3);
            history.push("/compose");
          }}
        />

        <BottomNavigationAction
          showLabel
          classes={navClasses}
          // label=""
          onClick={() => {
            setValue(4);
            history.push("/profile");
          }}
        />
      </BottomNavigation>

      <Divider variant="middle" />
    </div>
  );
}
