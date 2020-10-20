import React, { useState } from "react";
import colors from "../assets/colors";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
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

const useNavStyles = makeStyles((theme) => ({
  selected: {
    "& .MuiBottomNavigationAction-label": {
      color: colors.maikuu0,
    },
    "& .MuiSvgIcon-root": {
      color: colors.maikuu0,
    },
  },
}));

export default function Banner(props) {
  const classes = useStyles();
  const navClasses = useNavStyles();
  const history = useHistory();
  const [value, setValue] = useState(0);

  return (
    <div className="root">
      <BottomNavigation
        style={{ justifyContent: "space-evenly" }}
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
          icon={<ClearAllIcon />}
        />

        <BottomNavigationAction
          showLabel
          classes={navClasses}
          label="Compose"
          onClick={() => {
            setValue(1);
            history.push("/compose");
          }}
          icon={<CreateIcon />}
        />

        <BottomNavigationAction
          showLabel
          classes={navClasses}
          label="Profile"
          onClick={() => {
            setValue(2);
            console.log(value);
            history.push("/profile");
          }}
          icon={<ProfileIcon />}
        />
      </BottomNavigation>
    </div>
  );
}
