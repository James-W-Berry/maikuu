import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import Lottie from "react-lottie";
import * as waveAnimation from "../assets/wave-animation.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: waveAnimation.default,
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    fontSize: "10vw",
    padding: "0 30px",
    color: "#f7f7f5",
    marginTop: "20px",
  },
  heading: {
    fontFamily: "BadScript",
    color: "#f7f7f5",
  },
  text: {
    fontFamily: "BadScript",
    color: "#61aaa3",
    "&:hover": {
      color: "#f7f7f5",
    },
  },
  textInput: {
    "& label ": {
      color: "#f7f7f5",
      fontFamily: "BadScript",
    },
    "& label.Mui-focused": {
      fontFamily: "BadScript",
      color: "#f7f7f580",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#61aaa3",
    },
  },
  input: {
    fontFamily: "BadScript",
    color: "#f7f7f5",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#61aaa380",
    },
    fontFamily: "BadScript",
    backgroundColor: "#61aaa3",
    color: "#f7f7f5",
  },
  loader: {
    margin: theme.spacing(6, 0, 2),
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <div
          style={{
            width: "100vw",
            height: "30vh",
          }}
        >
          <Lottie options={defaultOptions} height={"30vh"} width={"100vw"} />
        </div>
        <Typography className={classes.title} component="h1" variant="h5">
          Maikuu
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <NavLink
                className={classes.text}
                variant="body2"
                style={{
                  textDecoration: "none",
                }}
                to="/signin"
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box style={{ marginTop: "100px" }} mt={5}>
        <Typography
          variant="body2"
          style={{ fontFamily: "BadScript", color: "#f7f7f5" }}
          align="center"
        >
          {"Copyright © "}
          <Link
            className={classes.text}
            style={{ textDecoration: "none" }}
            href="https://www.maikuu.app"
          >
            Maikuu
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Container>
  );
}
