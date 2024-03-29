import React, { useEffect } from "react";
import {
  makeStyles,
  Container,
  CssBaseline,
  Grid,
  Tooltip,
  MenuItem,
  Select,
  Dialog,
  FormControlLabel,
  withStyles,
  Checkbox,
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
import VizSensor from "react-visibility-sensor";
import PuffLoader from "react-spinners/PuffLoader";
import CloseIcon from "@material-ui/icons/Close";
import Cursor from "./Cursor/Cursor";

const SORT_OPTIONS = {
  LIKES_ASC: { column: "likes", direction: "asc" },
  LIKES_DESC: { column: "likes", direction: "desc" },
  DATE_ASC: { column: "date", direction: "asc" },
  DATE_DESC: { column: "date", direction: "desc" },
};

export default function Main(props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState("DATE_DESC");
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const user = props.user;
  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [focusedCardVisible, setFocusedCardVisible] = useState(false);
  const [focusedPost, setFocusedPost] = useState({});
  const [focusPointsVisible, setFocusPointsVisible] = useState(false);
  const imageContainer = document.querySelector("#backgroundImageGrid");
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const contentDiv = document.querySelector("#content");
  const [showHaikuOnImage, setShowHaikuOnImage] = useState(true);

  const MaikuuCheckbox = withStyles({
    root: {
      color: colors.maikuu4,
      "&$checked": {
        color: colors.maikuu0,
      },
    },
  })((props) => <Checkbox color="default" {...props} />);

  useEffect(() => {
    let retrievedPosts = [];
    firebase
      .firestore()
      .collection("posts")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .limit(1)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          retrievedPosts.push({ id: doc.id, ...doc.data() });
        });
        let allPosts = posts.concat(retrievedPosts);
        setPosts(allPosts);
        let lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisiblePost(lastPost);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [sortBy]);

  useEffect(() => {
    if (user.loggedIn && firebase.auth().currentUser?.uid) {
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
  }, [user.loggedIn]);

  const retrieveMorePosts = () => {
    setLoadingMorePosts(true);
    try {
      setLoadingMorePosts(true);
      let retrievedPosts = [];

      firebase
        .firestore()
        .collection("posts")
        .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
        .startAfter(lastVisiblePost)
        .limit(3)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            retrievedPosts.push({ id: doc.id, ...doc.data() });
          });
          let allPosts = posts.concat(retrievedPosts);
          setPosts(allPosts);
          let lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisiblePost(lastPost);
          setLoadingMorePosts(false);
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
          setLoadingMorePosts(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  function showFocusedCard(post) {
    setFocusedPost(post);
    contentDiv.style.overflow = "hidden";
    setFocusedCardVisible(true);
  }

  function hideFocusedCard() {
    setFocusedPost({});
    contentDiv.style.overflow = "auto";
    setFocusedCardVisible(false);
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
        <AnimatePresence>
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.0, 1.0] }}
            exit={{ opacity: 0 }}
          >
            {post.id === lastVisiblePost?.id ? (
              <VizSensor
                partialVisibility
                onChange={(isVisible) => {
                  if (isVisible) {
                    retrieveMorePosts();
                  }
                }}
              >
                <Card className={classes.root}>
                  <CardContent
                    className={classes.content}
                    style={{
                      backgroundImage: `url(${post.image})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundSize: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      showFocusedCard(post);
                    }}
                  >
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
                        <Tooltip
                          title="Sign in to like posts"
                          placement="bottom"
                        >
                          <span>
                            <IconButton aria-label="like post" disabled>
                              <LikeIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Typography
                          className={classes.numberLabel}
                          color="textSecondary"
                        >
                          {post.likes}
                        </Typography>

                        <Tooltip
                          title="Sign in to favorite posts"
                          placement="bottom"
                        >
                          <span>
                            <IconButton aria-label="add to favorites" disabled>
                              <FavoriteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* <Tooltip
                          title="Sign in to share posts"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              onClick={() => handleShare(post.id)}
                              aria-label="share"
                            >
                              <ShareIcon />
                            </IconButton>
                          </span>
                        </Tooltip> */}
                      </div>
                    </CardActions>
                  )}
                </Card>
              </VizSensor>
            ) : (
              <Card className={classes.root}>
                <CardContent
                  className={classes.content}
                  style={{
                    backgroundImage: `url(${post.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    showFocusedCard(post);
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "16px",
                    }}
                  >
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
                  </div>
                </CardContent>
                {user?.loggedIn ? (
                  <CardActions
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.5" }}
                  >
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
                        <span>
                          <IconButton aria-label="like post" disabled>
                            <LikeIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Typography
                        className={classes.numberLabel}
                        color="textSecondary"
                      >
                        {post.likes}
                      </Typography>
                    </div>
                  </CardActions>
                )}
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </Grid>
    );
  }

  function handleSortBy(sortBy) {
    setPosts([]);
    setSortBy(sortBy);
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{
          marginBottom: "60px",
          marginTop: "10px",
        }}
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        <div>
          <Container component="main" xl={12} lg={12} md={12}>
            <CssBaseline />

            <div className={classes.paper}>
              <Dialog
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
                scroll="paper"
                PaperProps={{ style: { backgroundColor: colors.maikuu0 } }}
                open={focusedCardVisible}
                onClose={() => {
                  hideFocusedCard();
                }}
                fullScreen
                fullWidth
                aria-labelledby="post"
                aria-describedby="focus on post"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    width: "100vw",
                    height: "100vh",
                    flexDirection: "column",
                    backgroundColor: colors.maikuu0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "inherit",
                      justifyContent: "flex-end",
                      marginRight: "20px",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        hideFocusedCard();
                        setFocusPointsVisible(false);
                      }}
                      aria-label="close carousel"
                      style={{
                        width: "40px",
                        alignSelf: "flex-end",
                        color: colors.maikuu4,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>

                  <Typography className={classes.focusHeading}>
                    {focusedPost.concept}
                  </Typography>

                  {focusPointsVisible && <Cursor />}

                  {focusPointsVisible ? (
                    <div
                      id="backgroundImageGrid"
                      style={{
                        cursor: "none",
                        position: "relative",
                        backgroundColor: "rgba(0,0,0,0.8)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={focusedPost.image}
                        alt="inspiration"
                        style={{
                          padding: "0px",
                          backgroundColor: "rgba(0,0,0,0)",
                          maxHeight: "75vh",
                          maxWidth: "100vw",
                        }}
                        draggable="false"
                      />

                      <Tooltip
                        open={showLine1}
                        classes={{
                          tooltip: classes.tooltip,
                        }}
                        title={
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            className={classes.focusedPost}
                          >
                            {focusedPost.line_1}
                          </Typography>
                        }
                        arrow
                      >
                        <div
                          className="handle"
                          style={{
                            position: "absolute",
                            cursor: "none",
                            zIndex: 100,
                            left: focusedPost.markers?.one.x,
                            top: focusedPost.markers?.one.y,
                            visibility:
                              focusPointsVisible && focusedPost.markers
                                ? "visible"
                                : "hidden",
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.3 }}
                            onHoverStart={() => {
                              setShowLine1(true);
                            }}
                            onHoverEnd={() => {
                              setShowLine1(false);
                            }}
                            whileTap={{ scale: 0.9 }}
                            onTap={() => {
                              setShowLine1(!showLine1);
                            }}
                            className={classes.marker}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              outlineWidth: 0,
                              cursor: "none",
                            }}
                          >
                            <Typography
                              style={{
                                textAlign: "center",
                                color: colors.maikuu0,
                              }}
                            >
                              1
                            </Typography>
                          </motion.button>
                        </div>
                      </Tooltip>

                      <Tooltip
                        open={showLine2}
                        classes={{
                          tooltip: classes.tooltip,
                        }}
                        title={
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            className={classes.focusedPost}
                          >
                            {focusedPost.line_2}
                          </Typography>
                        }
                        arrow
                      >
                        <div
                          className="handle"
                          style={{
                            position: "absolute",
                            cursor: "none",
                            zIndex: 100,
                            left: focusedPost.markers?.two.x,
                            top: focusedPost.markers?.two.y,
                            visibility:
                              focusPointsVisible && focusedPost.markers
                                ? "visible"
                                : "hidden",
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.3 }}
                            onHoverStart={() => {
                              setShowLine2(true);
                            }}
                            onHoverEnd={() => {
                              setShowLine2(false);
                            }}
                            whileTap={{ scale: 0.9 }}
                            onTap={() => {
                              setShowLine2(!showLine2);
                            }}
                            className={classes.marker}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              outlineWidth: 0,
                              cursor: "none",
                            }}
                          >
                            <Typography
                              style={{
                                textAlign: "center",
                                color: colors.maikuu0,
                              }}
                            >
                              2
                            </Typography>
                          </motion.button>
                        </div>
                      </Tooltip>

                      <Tooltip
                        open={showLine3}
                        classes={{
                          tooltip: classes.tooltip,
                        }}
                        title={
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            className={classes.focusedPost}
                          >
                            {focusedPost.line_3}
                          </Typography>
                        }
                        arrow
                      >
                        <div
                          className="handle"
                          style={{
                            position: "absolute",
                            cursor: "none",
                            zIndex: 100,
                            left: focusedPost.markers?.three.x,
                            top: focusedPost.markers?.three.y,
                            visibility:
                              focusPointsVisible && focusedPost.markers
                                ? "visible"
                                : "hidden",
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.3 }}
                            onHoverStart={() => {
                              setShowLine3(true);
                            }}
                            onHoverEnd={() => {
                              setShowLine3(false);
                            }}
                            whileTap={{ scale: 0.9 }}
                            onTap={() => {
                              setShowLine3(!showLine3);
                            }}
                            className={classes.marker}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              outlineWidth: 0,
                              cursor: "none",
                            }}
                          >
                            <Typography
                              style={{
                                textAlign: "center",
                                color: colors.maikuu0,
                              }}
                            >
                              3
                            </Typography>
                          </motion.button>
                        </div>
                      </Tooltip>
                    </div>
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: colors.maikuu0,
                      }}
                    >
                      <Card
                        className={classes.root}
                        style={{
                          backgroundColor: colors.maikuu0,
                          backgroundImage: `url(${focusedPost.image})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center center",
                          backgroundSize: "contain",
                          width: "100vw",
                          height: "100vw",
                          maxHeight: "75vh",
                        }}
                      >
                        <CardContent
                          className={classes.content}
                          style={{
                            width: imageContainer
                              ? imageContainer.clientWidth
                              : "75vh",
                            visibility: showHaikuOnImage ? "visible" : "hidden",
                          }}
                        >
                          <Typography
                            color="textSecondary"
                            gutterBottom
                            className={classes.post}
                          >
                            {focusedPost.title}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            className={classes.post}
                          >
                            {focusedPost.line_1}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            className={classes.post}
                          >
                            {focusedPost.line_2}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            className={classes.post}
                          >
                            {focusedPost.line_3}
                          </Typography>
                          <Typography
                            className={classes.title}
                            color="textSecondary"
                          >
                            {`-${focusedPost.author}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div style={{ display: "flex", direction: "row" }}>
                    {focusedPost.markers && (
                      <FormControlLabel
                        control={
                          <MaikuuCheckbox
                            checked={focusPointsVisible}
                            onChange={(event) => {
                              setFocusPointsVisible(!focusPointsVisible);
                            }}
                            name="checkedG"
                          />
                        }
                        label="Show Focus Points"
                        className={classes.lightHeading}
                      />
                    )}

                    {!focusPointsVisible && (
                      <FormControlLabel
                        control={
                          <MaikuuCheckbox
                            checked={showHaikuOnImage}
                            onChange={(event) => {
                              setShowHaikuOnImage(!showHaikuOnImage);
                            }}
                            name="haikuVisibleCheckbox"
                          />
                        }
                        label="Show Haiku"
                        className={classes.lightHeading}
                      />
                    )}
                  </div>
                </div>
              </Dialog>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  margin: "15px",
                }}
              >
                <Select
                  labelId="select-label"
                  id="select"
                  value={sortBy}
                  onChange={(event) => handleSortBy(event.target.value)}
                >
                  <MenuItem value={"LIKES_DESC"}>Likes more-less</MenuItem>
                  <MenuItem value={"LIKES_ASC"}>Likes less-more</MenuItem>
                  <MenuItem value={"DATE_DESC"}>Newest</MenuItem>
                  <MenuItem value={"DATE_ASC"}>Oldest</MenuItem>
                </Select>
              </div>

              <Grid container spacing={2}>
                {posts.map((post) => createFeedPost(post, userInfo))}
                {loadingMorePosts && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PuffLoader color={"#A0C4F2"} />
                  </div>
                )}
              </Grid>
            </div>
          </Container>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiCardActions-root": {
      backgroundColor: "rgba(0,0,0, 0.5)",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .MuiCardContent-root": {
      padding: "0px",
    },
  },
  content: {
    backgroundColor: "rgba(0,0,0, 0.5)",
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
    background: colors.maikuu5,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    color: colors.maikuu4,
  },
  focusHeading: {
    color: colors.maikuu4,
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    fontFamily: "BadScript",
    fontSize: "32px",
  },
  numberLabel: {
    fontSize: 14,
    textAlign: "left",
  },
  tooltip: {
    backgroundColor: colors.maikuu0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    color: colors.maikuu4,
  },
  focusedPost: {
    align: "center",
    textAlign: "center",
    fontFamily: "BadScript",
    color: colors.maikuu4,
    backgroundColor: colors.maikuu0,
  },
  lightSubmit: {
    backgroundColor: colors.maikuu4,
    color: colors.maikuu0,
    marginTop: "10px",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: colors.maikuu4,
      color: colors.maikuu0,
      opacity: "0.7",
    },
  },
  lightHeading: {
    color: colors.maikuu4,
    userSelect: "none",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  marker: {
    color: colors.maikuu4,
    borderRadius: "17px",
    backgroundColor: colors.lightBlue,
    height: 35,
    width: 35,
    outlineWidth: 0,
  },
}));
