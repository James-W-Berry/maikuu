import React, { useState } from "react";
import HaikuBuilder from "./HaikuBuilder";
import {
  Button,
  makeStyles,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Icon,
} from "@material-ui/core";
import colors from "../assets/colors";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveHaikuBuilder from "./InteractiveHaikuBuilder";
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "30px",
    marginTop: "15px",
    marginLeft: "15px",
  },
  heading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
  lightHeading: {
    color: colors.maikuu4,
    userSelect: "none",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  submit: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    marginTop: "30px",
  },
  signin: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    marginTop: "10px",
    marginBottom: "20px",
  },
}));

export default function Compose(props) {
  const classes = useStyles();
  const user = props.user;
  const [interactive, setInteractive] = useState(true);
  const [basic, setBasic] = useState(false);

  const setMode = (mode) => {
    if (mode === 0) {
      setInteractive(true);
      setBasic(false);
    } else {
      setInteractive(false);
      setBasic(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
        style={{ height: "100%" }}
      >
        {user?.loggedIn ? (
          <div
            style={{ display: "flex", flexDirection: "row", height: "100%" }}
          >
            <Grid container xl={12} lg={12} md={12}>
              <Grid
                style={{ backgroundColor: colors.maikuu0 }}
                key="control"
                item
                xs={12}
                sm={12}
                md={3}
                lg={3}
                xl={3}
              >
                <CssBaseline />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {basic ? (
                    <div
                      onClick={() => setMode(0)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <SwapHorizontalCircleIcon
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          color: colors.maikuu4,
                        }}
                      />

                      <Typography className={classes.lightHeading}>
                        Switch to the interactive experience
                      </Typography>
                    </div>
                  ) : (
                    <div
                      onClick={() => setMode(1)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <SwapHorizontalCircleIcon
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          color: colors.maikuu4,
                        }}
                      />
                      <Typography className={classes.lightHeading}>
                        Switch to the basic experience
                      </Typography>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid key="write" item xs={12} sm={12} md={9} lg={9} xl={9}>
                <CssBaseline />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {basic && (
                    <AnimatePresence>
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.0, 1.0] }}
                        exit={{ opacity: 0 }}
                      >
                        <HaikuBuilder user={user} setMode={setMode} />
                      </motion.div>
                    </AnimatePresence>
                  )}
                  {interactive && (
                    <AnimatePresence>
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.0, 1.0] }}
                        exit={{ opacity: 0 }}
                      >
                        <InteractiveHaikuBuilder
                          user={user}
                          setMode={setMode}
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>
            <Grid container spacing={2}>
              <CssBaseline />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                }}
              >
                <Typography className={classes.heading}>
                  Sign in to compose a Haiku
                </Typography>
                <NavLink
                  to="/signin"
                  style={{
                    color: colors.maikuu0,
                    textDecoration: "none",
                  }}
                >
                  <Button
                    classes={{
                      root: classes.signin,
                    }}
                  >
                    <Typography>Sign In</Typography>
                  </Button>
                </NavLink>
              </div>
            </Grid>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
