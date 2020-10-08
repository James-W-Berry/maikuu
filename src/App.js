import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Feed from "./components/Feed";
import Compose from "./components/Compose";
import Collections from "./components/Collections";
import firebase from "./firebase";
import "firebase/auth";
import SignUp from "./components/SignUp";
import LandingPage from "./components/LandingPage";
import ForgottenPassword from "./components/ForgottenPassword";
import PuffLoader from "react-spinners/PuffLoader";
import { motion } from "framer-motion";
import beach from "./assets/beach.mp4";
import Banner from "./components/Banner";
import colors from "./assets/colors";

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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Banner />
          <motion.div
            id="content"
            key={location.pathname}
            animate={{
              opacity: [0.9, 1.0],
            }}
            transition={{ duration: 1 }}
            style={{ marginTop: "60px" }}
          >
            <Switch location={location}>
              <Route path="/feed" component={Feed} />
              <Route path="/compose" component={Compose} />
              <Route path="/collections" component={Collections} />
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

  if (!user.loggedIn) {
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
    </UserProvider>
  );
}

export default App;
