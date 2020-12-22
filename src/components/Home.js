import React from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Container,
  CssBaseline,
  Grid,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import colors from "../assets/colors";
import { AnimatePresence, motion } from "framer-motion";
import feedGif from "../assets/feed.gif";
import pickGif from "../assets/compose-pick.gif";
import writeGif from "../assets/compose-write.gif";

export default function Home() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AnimatePresence>
      <motion.div
        key="root"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        <div>
          <Container component="main" xl={12} lg={12} md={12} sm={12} xs={12}>
            <CssBaseline />

            <div className={classes.paper}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Typography className={classes.heading}>
                    Welcome to Maikuu
                  </Typography>
                </Grid>
                <Divider variant="middle" className={classes.divider} />

                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography>
                    Explore haikus written by anyone from anywhere
                  </Typography>
                  <Button
                    className={classes.submit}
                    onClick={() => {
                      history.push("/feed");
                    }}
                  >
                    Check out the feed
                  </Button>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <img
                    src={feedGif}
                    alt="feed"
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </Grid>
                <Divider variant="middle" className={classes.divider} />

                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography>Become inspired to compose your own</Typography>
                    <Button
                      className={classes.submit}
                      onClick={() => {
                        history.push("/compose");
                      }}
                    >
                      Compose your haiku now
                    </Button>
                  </div>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={pickGif}
                      alt="feed"
                      style={{
                        height: "100%",
                        width: "100%",
                        margin: "10px",
                      }}
                    />
                    <img
                      src={writeGif}
                      alt="feed"
                      style={{
                        height: "100%",
                        width: "100%",
                        margin: "10px",
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiCardActions-root": {
      backgroundColor: "rgba(0,0,0, 0.5)",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .MuiCardContent-root": {
      padding: "0px",
    },
  },
  content: {
    backgroundColor: "rgba(0,0,0, 0.5)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gridTile: {
    width: "fitContent",
    height: "100% !important",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    background: colors.maikuu5,
  },
  submit: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    cursor: "pointer",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    color: colors.maikuu4,
  },
  numberLabel: {
    fontSize: 14,
    textAlign: "left",
  },
  heading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    fontFamily: "BadScript",
  },
  pos: {
    marginBottom: 12,
  },
  post: {
    align: "center",
    textAlign: "center",
    fontFamily: "BadScript",
    color: colors.maikuu4,
  },
  divider: {
    background: colors.maikuu0,
    width: "100%",
    marginTop: "20px",
    marginBottom: "20px",
  },
}));
