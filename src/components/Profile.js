import React, { useState, useEffect, useCallback } from "react";
import {
  makeStyles,
  Grid,
  Select,
  MenuItem,
  Container,
  CssBaseline,
  Button,
} from "@material-ui/core";
import colors from "../assets/colors";
import { AnimatePresence, motion } from "framer-motion";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import firebase from "../firebase";
import { NavLink, useHistory } from "react-router-dom";
import LogInOutIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gridTile: {
    width: "fitContent",
    height: "100% !important",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: colors.maikuu5,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
  },
  numberLabel: {
    fontSize: 14,
    textAlign: "left",
  },
  heading: {
    color: colors.maikuu0,
    userSelect: "none",
    fontSize: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
  pos: {
    marginBottom: 12,
  },
  post: {
    align: "center",
    textAlign: "center",
    fontFamily: "BadScript",
  },
  submit: {
    backgroundColor: colors.maikuu0,
    color: colors.maikuu4,
    marginTop: "10px",
    marginBottom: "20px",
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: "cover",
  },
}));

function logout(history) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      history.push("/signin");
    });
}

export default function Profile(props) {
  const classes = useStyles();
  const user = props.user;
  const [collection, setCollection] = useState("LIKES");
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [authoredPosts, setAuthoredPosts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (user.loggedIn) {
      const userId = firebase.auth().currentUser.uid;
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .onSnapshot(function (doc) {
          const user = doc.data();
          setUserInfo(user);
        });
    }
  }, [user]);

  useEffect(() => {
    let retrievedLikes = [];
    if (userInfo?.likes) {
      userInfo.likes.forEach((likedPost) => {
        firebase
          .firestore()
          .collection("posts")
          .where(firebase.firestore.FieldPath.documentId(), "==", likedPost)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              retrievedLikes.push({ id: doc.id, ...doc.data() });
            });
            setLikes(retrievedLikes);
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      });
    }
    let retrievedFavorites = [];
    if (userInfo?.favorites) {
      userInfo.favorites.forEach((favoritePost) => {
        firebase
          .firestore()
          .collection("posts")
          .where(firebase.firestore.FieldPath.documentId(), "==", favoritePost)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              retrievedFavorites.push({ id: doc.id, ...doc.data() });
            });
            setFavorites(retrievedFavorites);
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      });
    }

    let retrievedAuthoredPosts = [];
    if (userInfo?.authored) {
      userInfo.authored.forEach((authoredPost) => {
        firebase
          .firestore()
          .collection("posts")
          .where(firebase.firestore.FieldPath.documentId(), "==", authoredPost)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              retrievedAuthoredPosts.push({ id: doc.id, ...doc.data() });
            });
            setAuthoredPosts(retrievedAuthoredPosts);
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      });
    }
  }, [userInfo]);

  const requestLogout = useCallback(() => {
    logout(history);
  }, []);

  function createFeedPost(post) {
    return (
      <Grid
        key={post.id}
        className={classes.gridTile}
        item
        xs={12}
        sm={6}
        md={4}
        lg={4}
        xl={4}
      >
        <AnimatePresence>
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.0, 1.0] }}
            exit={{ opacity: 0 }}
          >
            <Card
              className={classes.root}
              style={{
                backgroundImage: `url(${post.image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }}
            >
              <CardContent className={classes.content}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  className={classes.post}
                >
                  {post.title}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className={classes.post}
                >
                  {post.line_1}
                </Typography>

                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className={classes.post}
                >
                  {post.line_2}
                </Typography>

                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className={classes.post}
                >
                  {post.line_3}
                </Typography>

                <Typography className={classes.title} color="textSecondary">
                  {`-${post.author}`}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Grid>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{ marginBottom: "60px", marginTop: "10px" }}
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        {user.loggedIn ? (
          <div>
            <Container component="main" xl={12} lg={12} md={12}>
              <CssBaseline />
              <Typography className={classes.heading}>
                {user.displayName ? user.displayName : userInfo.displayName}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {user?.loggedIn ? (
                  <NavLink
                    to="/signin"
                    style={{
                      color: colors.maikuu0,
                      textDecoration: "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      className={classes.submit}
                      endIcon={<LogInOutIcon />}
                      onClick={() => {
                        requestLogout();
                      }}
                    >
                      Logout
                    </Button>
                  </NavLink>
                ) : (
                  <NavLink
                    to="/signin"
                    style={{
                      color: colors.maikuu0,
                      textDecoration: "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      className={classes.submit}
                      endIcon={<LogInOutIcon />}
                    >
                      Login
                    </Button>
                  </NavLink>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Select
                  labelId="select-label"
                  id="select"
                  value={collection}
                  onChange={(event) => setCollection(event.target.value)}
                >
                  <MenuItem value={"FAVORITES"}>Favorite Posts</MenuItem>
                  <MenuItem value={"LIKES"}>Liked Posts</MenuItem>
                  <MenuItem value={"AUTHORED"}>Your Posts</MenuItem>
                </Select>
              </div>

              <div className={classes.paper}>
                <Grid
                  container
                  spacing={2}
                  style={{
                    margin: "10px",
                  }}
                >
                  {collection === "FAVORITES" &&
                    favorites.map((post) => createFeedPost(post))}
                  {collection === "LIKES" &&
                    likes.map((post) => createFeedPost(post))}
                  {collection === "AUTHORED" &&
                    authoredPosts.map((post) => createFeedPost(post))}
                </Grid>
              </div>
            </Container>
          </div>
        ) : (
          <div>
            <Container component="main" xl={12} lg={12} md={12}>
              <CssBaseline />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                }}
              >
                <Typography className={classes.heading}>
                  Sign in to view your profile
                </Typography>
                <NavLink
                  to="/signin"
                  style={{
                    color: colors.maikuu0,
                    textDecoration: "none",
                  }}
                >
                  <Button
                    classes={{
                      root: classes.submit,
                    }}
                  >
                    <Typography>Sign In</Typography>
                  </Button>
                </NavLink>
              </div>
            </Container>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
