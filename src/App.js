import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Main from "./components/Main";
import firebase from "./firebase";
import "firebase/auth";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import ForgottenPassword from "./components/ForgottenPassword";
import ScaleLoader from "react-spinners/ScaleLoader";
import { motion } from "framer-motion";
import beach from "./assets/beach.mp4";

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      callback({ loggedIn: true, email: user.email, isLoading: false });
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

  const AuthRoutes = () => (
    <Route
      render={({ location }) => (
        <motion.div
          key={location.pathname}
          animate={{
            opacity: [0, 1.0],
          }}
          transition={{ duration: 1 }}
        >
          <Switch location={location}>
            <Route path="/home" exact component={LandingPage} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotpassword" component={ForgottenPassword} />
            <Redirect to="/home" />
          </Switch>
        </motion.div>
      )}
    />
  );

  const FeatureRoutes = () => (
    <Route
      render={({ location }) => (
        <motion.div
          id="content"
          key={location.pathname}
          animate={{
            opacity: [0, 1.0],
          }}
          transition={{ duration: 1 }}
        >
          <Switch location={location}>
            <Route path="/feed" component={Main} />
            <Redirect to="/feed" />
          </Switch>
        </motion.div>
      )}
    />
  );

  if (user.isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#252a2e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <ScaleLoader color={"#A0C4F2"} />
      </div>
    );
  }

  if (!user.loggedIn) {
    return (
      <div
        style={{
          backgroundColor: "#252a2e",
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
            opacity: "50%",
          }}
          autoPlay
          muted
          loop
          id="beach"
          src={beach}
          type="video/mp4"
        />
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }
  return (
    <UserProvider value={user}>
      <div
        style={{
          backgroundColor: "#252a2e",
        }}
      >
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
        <BrowserRouter>{FeatureRoutes()}</BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
