import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import logo from "../assets/logo.png";
import logoBlue from "../assets/logo_blue.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ScaleLoader from "react-spinners/ScaleLoader";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontFamily: "AvenirNext",
    color: "#f7f7f5",
    marginTop: "15px",
  },
  logo: {
    flex: 1,
  },
  text: {
    fontFamily: "AvenirNext",
    color: "#f7f7f5",
    "&:hover": {
      color: "#A0C4F2",
    },
  },
  textInput: {
    minWidth: "40vw",
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
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(5),
    zIndex: "1",
  },
  form: {
    marginTop: "15px",
    width: "100%", // Fix IE 11 issue.
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    width: "75%",
    marginTop: "15px",
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

export default function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const classes = useStyles();
  const [logoSrc, setLogoSrc] = useState(logo);

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
    <div className={classes.container}>
      <div className={classes.paper}>
        <NavLink
          className={classes.text}
          style={{
            textDecoration: "none",
          }}
          to="/home"
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
          Forgotten Password
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid
              item
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
              <TextField
                className={classes.textInput}
                InputProps={{
                  className: classes.input,
                }}
                margin="normal"
                required
                fullWidth
                autoFocus
                name="email"
                label="Email to send reset link"
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
                style={{ color: "#f7f7f5" }}
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
              <ScaleLoader color={"#A0C4F2"} />
            </div>
          ) : (
            !success &&
            email.length > 0 && (
              <Button
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
    </div>
  );
}
