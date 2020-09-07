import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography } from "@material-ui/core";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";

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
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Button
        style={{
          backgroundColor: "#61aaa3",
          color: "#f7f7f5",
          fontFamily: "BadScript",
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
