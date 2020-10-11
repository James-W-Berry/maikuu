import React, { useEffect } from "react";
import {
  makeStyles,
  Container,
  CssBaseline,
  Grid,
  Tooltip,
  MenuItem,
  Select,
} from "@material-ui/core";
import colors from "../assets/colors";
import firebase from "../firebase";
import { useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LikeIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import { red, blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
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
}));

const SORT_OPTIONS = {
  LIKES_ASC: { column: "likes", direction: "asc" },
  LIKES_DESC: { column: "likes", direction: "desc" },
  DATE_ASC: { column: "date", direction: "asc" },
  DATE_DESC: { column: "date", direction: "desc" },
};

export default function Main(props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState("LIKES_DESC");
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const user = props.user;

  useEffect(() => {
    let retrievedPosts = [];
    firebase
      .firestore()
      .collection("posts")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .limit(10)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          retrievedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(retrievedPosts);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [sortBy]);

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;

    firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(function (doc) {
        const user = doc.data();
        setUserInfo(user);
        console.log(`Received user information update`);
      });
  }, []);

  function handleFavorite(postId) {
    const userId = firebase.auth().currentUser.uid;
    if (userInfo.favorites?.includes(postId)) {
      // remove from favorites
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set(
          {
            favorites: firebase.firestore.FieldValue.arrayRemove(postId),
          },
          { merge: true }
        )
        .then(() => {
          console.log(`Removed ${postId} from favorite posts`);
        })
        .catch(function (error) {
          console.log(`Error removing ${postId} from favorite posts: `, error);
        });
    } else {
      // add to favorites
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set(
          {
            favorites: firebase.firestore.FieldValue.arrayUnion(postId),
          },
          { merge: true }
        )
        .then(() => {
          console.log(`Added ${postId} to favorite posts`);
        })
        .catch(function (error) {
          console.log(`Error adding ${postId} to favorite posts: `, error);
        });
    }
  }

  function handleLike(postId) {
    const userId = firebase.auth().currentUser.uid;

    if (userInfo.likes?.includes(postId)) {
      // remove from liked posts
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set(
          { likes: firebase.firestore.FieldValue.arrayRemove(postId) },
          { merge: true }
        )
        .then(() => {
          console.log(`Removed ${postId} from liked posts`);
        })
        .catch((error) => {
          console.log(`Error removing ${postId} from liked posts`);
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.increment(-1) })
        .then(() => {
          console.log(`Decremented ${postId} likes`);
        })
        .catch((error) => {
          console.log(`Error decrementing ${postId} likes`);
        });
    } else {
      // add to liked posts
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set(
          { likes: firebase.firestore.FieldValue.arrayUnion(postId) },
          { merge: true }
        )
        .then(() => {
          console.log(`Added ${postId} to liked posts`);
        })
        .catch((error) => {
          console.log(`Error adding ${postId} to liked posts`);
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.increment(1) })
        .then(() => {
          console.log(`Incremented ${postId} likeds`);
        })
        .catch((error) => {
          console.log(`Error incrementing ${postId} likes`);
        });
    }
  }

  function createFeedPost(post, userInfo) {
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
        <Card className={classes.root}>
          <CardContent className={classes.root}>
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
          {user?.loggedIn ? (
            <CardActions>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  onClick={() => handleLike(post.id)}
                  aria-label="like post"
                >
                  {userInfo.likes?.includes(post.id) ? (
                    <LikeIcon style={{ color: blue[500] }} />
                  ) : (
                    <LikeIcon />
                  )}
                </IconButton>
                <Typography
                  className={classes.numberLabel}
                  color="textSecondary"
                >
                  {post.likes}
                </Typography>
                <IconButton
                  onClick={() => handleFavorite(post.id)}
                  aria-label="add to favorites"
                >
                  {userInfo.favorites?.includes(post.id) ? (
                    <FavoriteIcon style={{ color: red[500] }} />
                  ) : (
                    <FavoriteIcon />
                  )}
                </IconButton>
              </div>
            </CardActions>
          ) : (
            <CardActions>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="Sign in to like posts" placement="bottom">
                  <IconButton aria-label="like post" disabled>
                    <LikeIcon />
                  </IconButton>
                </Tooltip>
                <Typography
                  className={classes.numberLabel}
                  color="textSecondary"
                >
                  {post.likes}
                </Typography>

                <Tooltip title="Sign in to favorite posts" placement="bottom">
                  <IconButton aria-label="add to favorites" disabled>
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </CardActions>
          )}
        </Card>
      </Grid>
    );
  }

  function handleSortBy(sortBy) {
    setSortBy(sortBy);
  }

  return (
    <AnimatePresence>
      <motion.div
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        <div>
          <Container component="main" xl={12} lg={12} md={12}>
            <CssBaseline />
            <Typography className={classes.heading}>Feed</Typography>
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
                value={sortBy}
                onChange={(event) => handleSortBy(event.target.value)}
              >
                <MenuItem value={"LIKES_DESC"}>Most likes</MenuItem>
                <MenuItem value={"LIKES_ASC"}>Least likes</MenuItem>
                <MenuItem value={"DATE_DESC"}>Newest</MenuItem>
                <MenuItem value={"DATE_ASC"}>Oldest</MenuItem>
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
                {posts.map((post) => createFeedPost(post, userInfo))}
              </Grid>
            </div>
          </Container>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
