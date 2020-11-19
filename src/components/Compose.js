import React, { useState, useEffect } from "react";
import HaikuBuilder from "./HaikuBuilder";
import {
  Button,
  makeStyles,
  Typography,
  CssBaseline,
  Grid,
  IconButton,
  Divider,
  Container,
} from "@material-ui/core";
import colors from "../assets/colors";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveHaikuBuilder from "./InteractiveHaikuBuilder";
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle";
import abstract_nouns from "../assets/abstract_nouns.json";
import LoopIcon from "@material-ui/icons/Loop";

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
  lightHeadingInactive: {
    color: colors.maikuu4,
    opacity: "0.5",
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
    marginTop: "10px",
    marginBottom: "20px",
  },
  signin: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    marginTop: "10px",
    marginBottom: "20px",
  },
  divider: {
    background: colors.maikuu5,
  },
}));

export default function Compose(props) {
  const classes = useStyles();
  const user = props.user;
  const [interactive, setInteractive] = useState(true);
  const [basic, setBasic] = useState(false);
  const [reflectionNoun, setReflectionNoun] = useState();
  const [loadingNewNoun, setLoadingNewNoun] = useState(true);
  const [activeStep, setActiveStep] = useState("inspiration");

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
            <Grid container xl={12} lg={12} md={12} spacing={2}>
              <Grid
                key="control"
                style={{
                  backgroundColor: colors.maikuu0,
                  boxShadow: "5px 5px  5px rgba(0,0,0,0.3)",
                }}
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
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "90%",
                      }}
                    >
                      <div
                        onClick={() => {
                          setActiveStep("inspiration");
                          setMode(0);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px",
                          textAlign: "center",
                          cursor: "pointer",
                          width: "100%",
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
                          Interactive Mode
                        </Typography>
                      </div>
                      <Divider variant="middle" className={classes.divider} />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "90%",
                      }}
                    >
                      <div
                        onClick={() => {
                          setActiveStep("inspiration");
                          setMode(1);
                        }}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "20px",
                          textAlign: "center",
                          cursor: "pointer",
                          width: "100%",
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
                          Basic Mode
                        </Typography>
                      </div>
                      <Divider
                        variant="middle"
                        className={classes.divider}
                        style={{ width: "100%" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "90%",
                          width: "100%",
                        }}
                      >
                        <AnimatePresence>
                          <motion.div
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.0, 1.0] }}
                            exit={{ opacity: 0 }}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "90%",
                            }}
                          >
                            <Typography
                              className={classes.lightHeading}
                              style={{ display: "flex" }}
                            >
                              Reflect on
                            </Typography>
                          </motion.div>
                        </AnimatePresence>
                        {!loadingNewNoun ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              height: "90%",
                              width: "90%",
                            }}
                          >
                            <AnimatePresence>
                              <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.0, 1.0] }}
                                transition={{ duration: 2 }}
                                exit={{ opacity: 0 }}
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: "90%",
                                  width: "90%",
                                }}
                              >
                                <Typography
                                  className={classes.lightHeading}
                                  style={{
                                    fontFamily: "BadScript",
                                    fontSize: "32px",
                                  }}
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
                                  style={{ outline: "none" }}
                                >
                                  <LoopIcon style={{ color: colors.maikuu5 }} />
                                </IconButton>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              height: "90%",
                              width: "90%",
                            }}
                          >
                            <Typography
                              className={classes.lightHeading}
                              style={{
                                fontFamily: "BadScript",
                                fontSize: "32px",
                                color: colors.maikuu0,
                              }}
                            >
                              Loading
                            </Typography>
                          </div>
                        )}
                      </div>
                      <Divider
                        variant="middle"
                        className={classes.divider}
                        style={{ width: "100%" }}
                      />
                      <AnimatePresence>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2 }}
                          style={{
                            display: "flex",
                            flexDirection: "row ",
                            width: "90%",
                          }}
                        >
                          <Typography
                            className={
                              activeStep === "inspiration"
                                ? classes.lightHeading
                                : classes.lightHeadingInactive
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Select inspiration
                          </Typography>
                        </motion.div>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          transition={{ duration: 4 }}
                          exit={{ opacity: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "90%",
                          }}
                        >
                          <Typography
                            className={
                              activeStep === "focus"
                                ? classes.lightHeading
                                : classes.lightHeadingInactive
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Focus your reflection
                          </Typography>
                        </motion.div>
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.0, 1.0] }}
                          transition={{ duration: 6 }}
                          exit={{ opacity: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "90%",
                          }}
                        >
                          <Typography
                            className={
                              activeStep === "compose"
                                ? classes.lightHeading
                                : classes.lightHeadingInactive
                            }
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Compose
                          </Typography>
                        </motion.div>
                      </AnimatePresence>
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
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {basic && (
                    <AnimatePresence>
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.0, 1.0] }}
                        exit={{ opacity: 0 }}
                        style={{ height: "90%", width: "90%" }}
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
                        style={{ height: "100%", width: "100%" }}
                      >
                        <InteractiveHaikuBuilder
                          user={user}
                          setMode={setMode}
                          setActiveStep={setActiveStep}
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
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
                Sign in to compose a haiku
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
                    root: classes.submit,
                  }}
                >
                  <Typography>Sign In</Typography>
                </Button>
              </NavLink>
            </div>
          </Container>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
