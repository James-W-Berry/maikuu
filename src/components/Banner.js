import React, { useState } from "react";
import colors from "../assets/colors";
import logo from "../assets/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

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

export default function Banner() {
  const classes = useStyles();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "15vh",
        width: "100vw",
        alignItems: "center",
        backgroundColor: colors.almostBlack,
      }}
    >
      <img
        style={{ marginLeft: "20px", height: "8vh", width: "8vh" }}
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
    </div>
  );
}
