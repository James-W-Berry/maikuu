import React, { useState, useEffect, useCallback } from "react";
import colors from "../assets/colors";
import logo from "../assets/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: "#f7f7f5",
    userSelect: "none",
    fontSize: "50px",
    marginTop: "15px",
    marginLeft: "15px",
    width: "20vw",
  },
  bannerOption: {
    fontFamily: "AvenirNext",
    color: "#f7f7f5",
    userSelect: "none",
    fontSize: "16px",
    paddingLeft: "2.5vw",
    paddingRight: "2.5vw",
  },
}));

function logout() {
  firebase.auth().signOut();
}

export default function Banner() {
  const classes = useStyles();

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "15vh",
        minHeight: "80px",
        width: "100vw",
        alignItems: "center",
        backgroundColor: colors.maikuu0,
      }}
    >
      <img
        style={{ marginLeft: "20px", height: "60px", width: "60px" }}
        alt="logo"
        src={logo}
      />
      <span className={classes.title}>Maikuu</span>
      <div
        style={{
          display: "flex",
          width: "44vw",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NavLink
          className={classes.bannerOption}
          style={{
            textDecoration: "none",
          }}
          to="/feed"
        >
          Feed
        </NavLink>
        <NavLink
          className={classes.bannerOption}
          style={{
            textDecoration: "none",
          }}
          to="/compose"
        >
          Compose
        </NavLink>
        <NavLink
          className={classes.bannerOption}
          style={{
            textDecoration: "none",
          }}
          to="/collections"
        >
          Collections
        </NavLink>
      </div>
      <div
        style={{
          display: "flex",
          width: "27vw",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            backgroundColor: colors.darkBlue,
            color: colors.white,
          }}
          onClick={requestLogout}
        >
          <Typography>Logout</Typography>
          <LogoutIcon />
        </Button>
      </div>
    </div>
  );
}
