import React, { useState, useCallback } from "react";
import colors from "../assets/colors";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import firebase from "../firebase";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import CreateIcon from "@material-ui/icons/Create";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ProfileIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  stickToBottom: {
    width: "100%",
    position: "fixed",
    bottom: 0,
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

export default function Banner(props) {
  const classes = useStyles();
  const user = props.user;
  const [value, setValue] = useState(0);

  return (
    <div className="root">
      <BottomNavigation
        style={{ justifyContent: "space-evenly" }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.stickToBottom}
      >
        <NavLink
          to="/feed"
          style={{
            textDecoration: "none",
            color: colors.maikuu0,
          }}
        >
          <BottomNavigationAction label="Feed" icon={<ClearAllIcon />} />
        </NavLink>

        <NavLink
          to="/compose"
          style={{
            textDecoration: "none",
            color: colors.maikuu0,
          }}
        >
          <BottomNavigationAction label="Compose" icon={<CreateIcon />} />
        </NavLink>

        <NavLink
          to="/profile"
          style={{
            textDecoration: "none",
            color: colors.maikuu0,
          }}
        >
          <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
        </NavLink>
      </BottomNavigation>
    </div>
  );
}
