import React, { useState, useEffect, useCallback } from "react";
import colors from "../assets/colors";
import logo from "../assets/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";
import MenuIcon from "@material-ui/icons/Menu";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import CreateIcon from "@material-ui/icons/Create";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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

function logout() {
  firebase.auth().signOut();
}

export default function Banner() {
  const classes = useStyles();

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <NavLink
          to="/feed"
          style={{
            textDecoration: "none",
            color: colors.maikuu0,
          }}
        >
          <ListItem button key={"Feed"}>
            <ListItemIcon>
              <ClearAllIcon />
            </ListItemIcon>
            <ListItemText primary={"Feed"} />
          </ListItem>
        </NavLink>

        <NavLink
          to="/compose"
          style={{
            textDecoration: "none",
            color: colors.maikuu0,
          }}
        >
          <ListItem button key={"Compose"}>
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary={"Compose"} />
          </ListItem>
        </NavLink>

        <NavLink
          to="/collections"
          style={{
            color: colors.maikuu0,
            textDecoration: "none",
          }}
        >
          <ListItem button key={"Collections"}>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary={"Collections"} />
          </ListItem>
        </NavLink>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Log out"}>
          <ListItemIcon>{<LogoutIcon />}</ListItemIcon>
          <ListItemText primary={"Log out"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="root">
      <AppBar className={classes.appbar} position="fixed">
        <Toolbar>
          <SwipeableDrawer
            anchor={"menu"}
            open={state["menu"]}
            onClose={toggleDrawer("menu", false)}
            onOpen={toggleDrawer("menu", true)}
          >
            {list("menu")}
          </SwipeableDrawer>
          <React.Fragment key={"menu"}>
            <IconButton
              key="menu"
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer("menu", true)}
            >
              <MenuIcon />
            </IconButton>
          </React.Fragment>
          <Typography variant="h6" className={classes.title}>
            Maikuu
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
