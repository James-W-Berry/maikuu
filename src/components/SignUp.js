import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import logo from "../assets/logo.png";
import logoBlue from "../assets/logo_blue.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ScaleLoader from "react-spinners/ScaleLoader";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import randomName from "human-readable-ids";
import beach from "../assets/beach.mp4";

const useStyles = makeStyles((theme) => ({
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
  logo: {
    flex: 1,
  },
  textInput: {
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
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(10),
    zIndex: "1",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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
  loader: {
    margin: theme.spacing(6, 0, 2),
  },
}));

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const classes = useStyles();
  const [logoSrc, setLogoSrc] = useState(logo);

  function onSignUp(username, email, password) {
    setIsLoading(true);
    const db = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        var userId = firebase.auth().currentUser.uid;

        db.collection("users")
          .doc(userId)
          .set({
            displayName: username,
            displayNameVisible: false,
            group: "ETVOvDEqnWL9I7fURN3D",
          })
          .catch(function (error) {
            console.log(error);
          });

        console.log("sign up successful");
      })
      .catch(function (error) {
        var errorMessage = error.message;
        setIsLoading(false);
        setFailure(true);
        setFailureMessage(errorMessage);
      });
  }

  return (
    <div className={classes.container}>
      <video
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: "0",
          objectFit: "cover",
          opacity: "50%",
        }}
        autoPlay
        muted
        loop
        id="beach"
        src={beach}
        type="video/mp4"
      />

      <Container style={{ zIndex: "1" }} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <NavLink
            style={{
              textDecoration: "none",
            }}
            to="/"
          >
            <img
              src={logoSrc}
              onMouseOver={() => setLogoSrc(logoBlue)}
              onMouseOut={() => setLogoSrc(logo)}
              alt=""
              height="80"
              width="80"
              className={classes.logo}
            />
          </NavLink>
          <Typography className={classes.heading} component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  className={classes.textInput}
                  margin="normal"
                  autoFocus
                  required
                  fullWidth
                  name="userName"
                  type="username"
                  id="userName"
                  label="User name"
                  defaultValue={randomName.hri.random()}
                  InputProps={{
                    className: classes.input,
                  }}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textInput}
                  InputProps={{
                    className: classes.input,
                  }}
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  id="email"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textInput}
                  margin="normal"
                  required
                  fullWidth
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
              </Grid>
            </Grid>
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
                  style={{ color: "#f7f7f5" }}
                  component="h1"
                  variant="body2"
                >
                  {`${failureMessage}`}
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
                <ScaleLoader color={"#A0C4F2"} />
              </div>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  onSignUp(username, email, password);
                }}
              >
                Sign Up
              </Button>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}
