import React from "react";
import { makeStyles, Grid,  } from "@material-ui/core";
import colors from "../assets/colors";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "30px",
    marginTop: "15px",
    marginLeft: "15px",
  },
   gridTile: {
    width: "fitContent",
    height: "100% !important",
  },
}));

export default function Profile(props) {
  const classes = useStyles();
  const user = props.user;

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "top",
        alignItems: "center",
        width: "100vw",
        height: "85vh",
        marginTop: '10px',
        backgroundColor: colors.maikuu5,
      }}
    >
      {user?.loggedIn ? (
        <AnimatePresence>
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            transition={{ duration: 1.0 }}
            exit={{ opacity: 0 }}
          >
            <span className={classes.title}>{user.displayName}</span>
            <Grid
              container
              spacing={2}
              style={{
                margin: "10px",
              }}
            >
              <Grid
                key="liked"
                className={classes.gridTile}
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
              >
                <span>Liked Posts</span>
              </Grid>
          </Grid>
        </motion.div>
                </AnimatePresence>

      ) : (
        <AnimatePresence>
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            transition={{ duration: 1.0 }}
            exit={{ opacity: 0 }}
          >
            <span className={classes.title}>Sign in to view your Profile</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
