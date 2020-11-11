import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Feed from "./components/Feed";
import Compose from "./components/Compose";
import Profile from "./components/Profile";
import firebase from "./firebase";
import "firebase/auth";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import ForgottenPassword from "./components/ForgottenPassword";
import PuffLoader from "react-spinners/PuffLoader";
import { motion } from "framer-motion";
import Banner from "./components/Banner";
import colors from "./assets/colors";
import { Divider, Typography } from "@material-ui/core";
import logo from "./assets/logo.png";

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      callback({
        loggedIn: true,
        email: user.email,
        isLoading: false,
        displayName: user.displayName,
      });
    } else {
      callback({ loggedIn: false, isLoading: false });
    }
  });
}

function App() {
  const [user, setUser] = useState({ loggedIn: false, isLoading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  let FeatureRoutes = () => (
    <Route
      render={({ location }) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {location.pathname.match("signin|signup|forgotpassword") == null ? (
            <div>
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100vw",
                  margin: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60px",
                    width: "60px",
                    cursor: "pointer",
                  }}
                />
              </div> */}
              <Divider variant="middle" />
            </div>
          ) : null}

          {location.pathname.match("signin|signup|forgotpassword") == null ? (
            <Banner user={user} />
          ) : null}

          <motion.div
            id="content"
            key={location.pathname}
            animate={{
              opacity: [0.9, 1.0],
            }}
            transition={{ duration: 1 }}
          >
            <Switch location={location}>
              <Route path="/feed" render={() => <Feed user={user} />} />
              <Route path="/compose" render={() => <Compose user={user} />} />
              <Route path="/profile" render={() => <Profile user={user} />} />
              <Route
                path="/signin"
                render={() => <LandingPage user={user} />}
              />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgotpassword" component={ForgottenPassword} />
              <Redirect to="/feed" />
            </Switch>
          </motion.div>
        </div>
      )}
    />
  );

  if (user.isLoading) {
    return (
      <div
        style={{
          backgroundColor: colors.maikuu4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <PuffLoader color={"#A0C4F2"} />
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: "100%",
        width: "100%",
        minHeight: "100%",
        height: "100%",
        position: "absolute",
        zIndex: "0",
        backgroundColor: colors.maikuu5,
      }}
    >
      <BrowserRouter>{FeatureRoutes()}</BrowserRouter>
    </div>
  );
}

export default App;
