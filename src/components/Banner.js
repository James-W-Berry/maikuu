import React, { useState, useCallback } from "react";
import colors from "../assets/colors";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, useHistory } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import logo from "../assets/logo_blue.png";
import { Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import firebase from "../firebase";
import LogInOutIcon from "@material-ui/icons/ExitToApp";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

const drawerWidth = 240;

export default function Banner(props) {
  const user = props.user;
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = useState(0);

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  function logout(history) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push("/signin");
      });
  }

  const requestLogout = useCallback(() => {
    logout(history);
  }, [history]);

  return (
    <div style={{ zIndex: "1" }}>
      <BottomNavigation
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        value={value}
        showLabels
        className={classes.stickToTop}
      >
        <React.Fragment key={"left"}>
          <Button onClick={toggleDrawer("left", true)}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              style={{ outline: "none" }}
            >
              <MenuIcon
                style={{
                  color: colors.maikuu4,
                }}
              />
            </IconButton>
          </Button>
          <Drawer
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            <List>
              <ListItem
                button
                key="Feed"
                onClick={() => {
                  history.push("/feed");
                  setState({ left: false });
                }}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <ListItemIcon>
                  <HomeIcon style={{ color: colors.maikuu4 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Feed"
                  style={{
                    color: colors.maikuu4,
                  }}
                />
              </ListItem>
              <ListItem
                button
                key="Compose"
                onClick={() => {
                  history.push("/compose");
                  setState({ left: false });
                }}
              >
                <ListItemIcon>
                  <PostAddIcon style={{ color: colors.maikuu4 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Compose"
                  style={{ color: colors.maikuu4 }}
                />
              </ListItem>
              <ListItem
                button
                key="Profile"
                onClick={() => {
                  history.push("/profile");
                  setState({ left: false });
                }}
              >
                <ListItemIcon>
                  <AccountBoxIcon style={{ color: colors.maikuu4 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  style={{ color: colors.maikuu4 }}
                />
              </ListItem>
            </List>
            <Divider variant="middle" className={classes.divider} />
            <List>
              {user.loggedIn ? (
                <ListItem
                  button
                  key="Logout"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <NavLink
                    to="/signin"
                    style={{
                      color: colors.maikuu0,
                      textDecoration: "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      className={classes.submit}
                      endIcon={<LogInOutIcon />}
                      onClick={() => {
                        requestLogout();
                      }}
                    >
                      Logout
                    </Button>
                  </NavLink>
                </ListItem>
              ) : (
                <ListItem
                  button
                  key="Login"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <NavLink
                    to="/signin"
                    style={{
                      color: colors.maikuu0,
                      textDecoration: "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      className={classes.submit}
                      endIcon={<LogInOutIcon />}
                    >
                      Login
                    </Button>
                  </NavLink>
                </ListItem>
              )}
            </List>
          </Drawer>
        </React.Fragment>
        <div
          style={{
            display: "flex",
            cursor: "pointer",
            alignItems: "center",
            marginLeft: "20px",
          }}
          onClick={() => {
            setValue(2);
            history.push("/home");
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "28px",
              width: "28px",
            }}
          />
          <Typography
            style={{
              fontFamily: "BadScript",
              fontSize: "28px",
              color: colors.maikuu4,
              marginLeft: "10px",
              alignSelf: "baseline",
            }}
          >
            Maikuu
          </Typography>
        </div>
      </BottomNavigation>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  stickToTop: {
    width: "100%",
    position: "fixed",
    top: 0,
    backgroundColor: colors.maikuu0,
    boxShadow: "5px 5px  5px rgba(0,0,0,0.3)",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: colors.maikuu0,
  },
  divider: {
    background: colors.maikuu4,
  },
}));
