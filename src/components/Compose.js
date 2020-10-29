import React, { useState } from "react";
import HaikuBuilder from "./HaikuBuilder";
import {
  Button,
  makeStyles,
  Typography,
  Container,
  CssBaseline,
} from "@material-ui/core";
import colors from "../assets/colors";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveHaikuBuilder from "./InteractiveHaikuBuilder";

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
    fontSize: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
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
  const [interactive, setInteractive] = useState(false);
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
        style={{ marginBottom: "60px", marginTop: "10px" }}
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        {user?.loggedIn ? (
          <div>
            <Container component="main" xl={12} lg={12} md={12}>
              <CssBaseline />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {!basic && !interactive && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "70vh",
                    }}
                  >
                    <Button onClick={() => setMode(0)}>
                      <Typography className={classes.heading}>
                        Interactive Experience
                      </Typography>
                    </Button>

                    <Button
                      onClick={() => {
                        setMode(1);
                      }}
                    >
                      <Typography className={classes.heading}>
                        or Basic Experience ?
                      </Typography>
                    </Button>
                  </div>
                )}
                {basic && (
                  <AnimatePresence>
                    <motion.div
                      style={{ marginBottom: "60px", marginTop: "10px" }}
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
                      style={{ marginBottom: "60px", marginTop: "10px" }}
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.0, 1.0] }}
                      exit={{ opacity: 0 }}
                    >
                      <InteractiveHaikuBuilder user={user} setMode={setMode} />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </Container>
          </div>
        ) : (
          <div>
            <Container component="main" xl={12} lg={12} md={12}>
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
            </Container>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
