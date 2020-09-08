import React, { useState, useEffect } from "react";
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
import firebase from "../firebase";
import "firebase/auth";
import ScaleLoader from "react-spinners/ScaleLoader";
import TextField from "@material-ui/core/TextField";
import { ButtonBase } from "@material-ui/core";
import google from "../assets/google.png";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: waveAnimation.default,
  rendererSettings: {
    preserveAspectRatio: "none",
  },
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    fontSize: "60px",
    paddingTop: "20%",
    color: "#f7f7f5",
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
    flexGrow: 1,
    height: "100vh",
    width: "100vw",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    // marginTop: "20vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    width: "50%",
    margin: theme.spacing(6, 0, 2),
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#61aaa380",
    },
    fontFamily: "BadScript",
    backgroundColor: "#61aaa3",
    color: "#f7f7f5",
  },
  googleSubmit: {
    width: "50%",
    margin: theme.spacing(6, 0, 2),
    backgroundColor: "#FFFFFF00",
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#FFFFFF00",
    },
  },
  loader: {
    margin: theme.spacing(6, 0, 2),
  },
}));

const provider = new firebase.auth.GoogleAuthProvider();

function onRedirectResult() {
  firebase
    .auth()
    .getRedirectResult()
    .then(function (result) {
      console.log(result);
      //   if (result.credential) {
      //     // This gives you a Google Access Token. You can use it to access the Google API.
      //     var token = result.credential.accessToken;
      //     // ...
      //   }
      //   // The signed-in user info.
      //   var user = result.user;
      // })
      // .catch(function (error) {
      //   // Handle Errors here.
      //   var errorCode = error.code;
      //   var errorMessage = error.message;
      //   // The email of the user's account used.
      //   var email = error.email;
      //   // The firebase.auth.AuthCredential type that was used.
      //   var credential = error.credential;
      // ...
    });
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const classes = useStyles();

  function unsubscribe() {
    onRedirectResult();
  }
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  function onSignIn(email, password) {
    setIsLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        setIsLoading(false);
        setFailure(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        setFailure(true);
      });
  }

  function onGoogleSignIn() {
    setIsLoading(true);
    firebase.auth().signInWithRedirect(provider);
  }

  return (
    <div className={classes.paper}>
      <Grid
        container
        spacing={5}
        style={{
          height: "100vh",
          width: "100vw",
          padding: "0px",
          margin: "0px",
        }}
      >
        <Grid
          item
          xl={6}
          lg={6}
          md={6}
          s={12}
          xs={12}
          style={{ padding: "0px" }}
        >
          <div
            style={{
              flex: "1",
              position: "relative",
              padding: "0px",
              zIndex: "1",
              width: "100%",
              height: "100%",
              minHeight: "50vh",
              alignItems: "center",
            }}
          >
            <Typography
              className={classes.title}
              style={{
                position: "absolute",
                width: "100%",
                padding: "0px",
                top: "10%",
                zIndex: "3",
                textAlign: "center",
                userSelect: "none",
              }}
            >
              Maikuu
            </Typography>

            <Lottie
              options={defaultOptions}
              height={"80%"}
              width={"100%"}
              style={{
                top: "20%",
                position: "absolute",
                zIndex: "2",
              }}
            />
          </div>
        </Grid>

        <Grid
          item
          xl={6}
          lg={6}
          md={6}
          s={12}
          xs={12}
          style={{
            display: "flex",
            flex: 4,
            flexDirection: "column",
            justifyContent: "center",
            padding: "0px",
          }}
        >
          <form className={classes.form} noValidate>
            <TextField
              className={classes.textInput}
              InputProps={{
                className: classes.input,
              }}
              margin="normal"
              required
              style={{ width: "80%" }}
              name="email"
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
              autoFocus
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <TextField
              className={classes.textInput}
              margin="normal"
              required
              style={{ width: "80%" }}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                className: classes.input,
              }}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            {failure && (
              <div
                className={classes.loader}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  className={classes.heading}
                  style={{ color: "#61aaa3" }}
                  component="h1"
                  variant="body2"
                >
                  {`Incorrect email or password, please try again`}
                </Typography>
              </div>
            )}
            {isLoading ? (
              <div
                className={classes.loader}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScaleLoader color={"#61aaa3"} />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => {
                    onSignIn(email, password);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.googleSubmit}
                  style={{ padding: "0px" }}
                  onClick={() => {
                    onGoogleSignIn();
                  }}
                >
                  <img src={google} width="100%" alt="Sign in with Google" />
                </Button>
              </div>
            )}

            <Grid
              container
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Grid item xs>
                <NavLink
                  className={classes.text}
                  style={{
                    textDecoration: "none",
                  }}
                  to="/forgotpassword"
                >
                  Forgot password?
                </NavLink>
              </Grid>
              <Grid item xs>
                <NavLink
                  className={classes.text}
                  style={{
                    textDecoration: "none",
                  }}
                  to="/signup"
                >
                  {"Don't have an account? Sign Up"}
                </NavLink>
              </Grid>
            </Grid>
          </form>
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
        </Grid>
      </Grid>
    </div>
  );
}
