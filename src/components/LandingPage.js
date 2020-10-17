import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, useHistory } from "react-router-dom";
import firebase from "../firebase";
import "firebase/auth";
import PuffLoader from "react-spinners/PuffLoader";
import TextField from "@material-ui/core/TextField";
import { Divider } from "@material-ui/core";
import google from "../assets/google.png";
import beach from "../assets/beach_noir.mp4";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    fontSize: "60px",
    color: "#f7f7f5",
  },
  heading: {
    fontFamily: "AvenirNext",
    color: "#f7f7f5",
  },
  text: {
    fontFamily: "AvenirNext",
    color: "#f7f7f5",
    "&:hover": {
      color: "#A0C4F2",
    },
  },
  textInput: {
    width: "60%",
    "& label ": {
      color: "#f7f7f5",
      fontFamily: "AvenirNext",
    },
    "& label.Mui-focused": {
      fontFamily: "AvenirNext",
      color: "#f7f7f5",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#A0C4F2",
    },
  },
  input: {
    fontFamily: "AvenirNext",
    color: "#f7f7f5",
  },
  paper: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    width: "50%",
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#384A5980",
    },
    fontFamily: "AvenirNext",
    backgroundColor: "#384A59",
    color: "#f7f7f5",
  },
  googleSubmit: {
    width: "50%",
    backgroundColor: "#f7f7f5",
    "&:hover": {
      color: "#f7f7f5",
      backgroundColor: "#f7f7f580",
    },
    color: "#f7f7f5",
  },
  loader: {
    margin: theme.spacing(6, 0, 2),
  },
  divider: {
    background: "#ffffff",
    width: "60%",
    marginTop: "10%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const provider = new firebase.auth.GoogleAuthProvider();

export default function LandingPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const user = props.user;
  const classes = useStyles();
  const history = useHistory();

  function onRedirectResult() {
    firebase
      .auth()
      .getRedirectResult()
      .then(function (result) {
        console.log(result);
      });
  }

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
    firebase
      .auth()
      .signInWithRedirect(provider)
      .then(() => {
        console.log("signed in with Google redirect");
      });
  }

  if (user?.loggedIn) {
    history.push("/feed");
  }

  return (
    <div
      style={{
        backgroundColor: colors.maikuu4,
      }}
    >
      <video
        style={{
          flex: 1,
          minWidth: "100%",
          width: "100%",
          minHeight: "100%",
          height: "100%",
          position: "absolute",
          zIndex: "0",
          objectFit: "cover",
          opacity: "100%",
        }}
        autoPlay
        muted
        loop
        id="beach"
        src={beach}
        type="video/mp4"
      />
      <div className={classes.container}>
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
                  display: "flex",
                  padding: "0px",
                  zIndex: "1",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                  }}
                  to="/feed"
                >
                  <Typography
                    className={classes.title}
                    style={{
                      width: "100%",
                      padding: "0px",
                      top: "40%",
                      zIndex: "3",
                      textAlign: "center",
                      userSelect: "none",
                    }}
                  >
                    Maikuu
                  </Typography>
                </NavLink>
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
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px",
                zIndex: "1",
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
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <TextField
                  className={classes.textInput}
                  margin="normal"
                  required
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
                      style={{ color: "#f2f2eb" }}
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
                    <PuffLoader color={"#A0C4F2"} />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      //justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      style={{ marginTop: "20px" }}
                      onClick={() => {
                        onSignIn(email, password);
                      }}
                    >
                      Sign In
                    </Button>

                    <Typography className={classes.text}>or</Typography>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.googleSubmit}
                      style={{
                        padding: "0px",
                        marginTop: "0px",
                        margin: "0px",
                      }}
                      onClick={() => {
                        onGoogleSignIn();
                      }}
                    >
                      <img
                        src={google}
                        width="100%"
                        alt="Sign in with Google"
                      />
                    </Button>
                  </div>
                )}
              </form>

              <Divider
                variant="middle"
                classes={{ root: classes.divider }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />

              <Grid
                container
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "30px",
                  zIndex: "1",
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

                <Box style={{ marginTop: "100px" }} mt={5}>
                  <Typography
                    variant="body2"
                    style={{ fontFamily: "AvenirNext", color: "#f7f7f5" }}
                    align="center"
                  >
                    {"Copyright © "}
                    <Link
                      className={classes.text}
                      style={{
                        textDecoration: "none",
                        fontFamily: "BadScript",
                      }}
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
          </Grid>
        </div>
      </div>
    </div>
  );
}
