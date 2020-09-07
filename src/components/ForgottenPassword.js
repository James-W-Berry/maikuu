import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import logo from "../assets/logo.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ScaleLoader from "react-spinners/ScaleLoader";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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

export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const classes = useStyles();

  function onResetPassword(email) {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setIsLoading(false);
        setFailure(false);
        setSuccess(true);
      })
      .catch(function (error) {
        setIsLoading(false);
        setSuccess(false);
        setFailure(true);
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <NavLink
          className={classes.text}
          style={{
            textDecoration: "none",
          }}
          to="/"
        >
          <img src={logo} alt="" height="80" width="80" style={{ flex: 1 }} />
        </NavLink>
        <Typography className={classes.heading} component="h1" variant="h5">
          Forgotten Password
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
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
          </Grid>
          {success && (
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
                component="h1"
                variant="body2"
              >
                Check your email for the reset link
              </Typography>
            </div>
          )}
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
                {`No user found, please check the entered email`}
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
            !success && (
              <Button
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={() => {
                  onResetPassword(email);
                }}
              >
                Reset Password
              </Button>
            )
          )}
        </form>
      </div>
    </Container>
  );
}
