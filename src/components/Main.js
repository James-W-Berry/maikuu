import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography } from "@material-ui/core";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";
import HaikuBuilder from "./HaikuBuilder";
import Banner from "./Banner";
import colors from "../assets/colors";

function logout() {
  firebase.auth().signOut();
}

function Main() {
  const requestLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flexStart",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Banner />
      <HaikuBuilder />
      <Button
        style={{
          backgroundColor: colors.darkBlue,
          color: colors.white,
          marginTop: "100px",
        }}
        onClick={requestLogout}
      >
        <Typography>Logout</Typography>
        <LogoutIcon />
      </Button>
    </div>
  );
}

export default Main;
