import React, { useEffect } from "react";
import {
  makeStyles,
  Container,
  CssBaseline,
  Grid,
  Tooltip,
  MenuItem,
  Select,
  Popover,
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
import ShareIcon from "@material-ui/icons/Share";
import IconButton from "@material-ui/core/IconButton";
import { AnimatePresence, motion } from "framer-motion";
import { red, blue } from "@material-ui/core/colors";
import VizSensor from "react-visibility-sensor";
import PuffLoader from "react-spinners/PuffLoader";
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
} from "react-share";
import Highlight from "./Highlight";
import logo from "../assets/logo_blue.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiCardActions-root": {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
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
    //alignItems: "center",
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
  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const shareUrl = "http://maikuu.app";
  const shareTitle = "Maikuu";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedShare, setSelectedShare] = useState(null);
  const id = open ? `share-${selectedShare}` : undefined;

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
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const retrieveMorePosts = () => {
    console.log("retrieving more posts");
    setLoadingMorePosts(true);
    try {
      setLoadingMorePosts(true);
      let retrievedPosts = [];

      firebase
        .firestore()
        .collection("posts")
        .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
        .startAfter(lastVisiblePost)
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

  function handleShare(postId, event) {
    setAnchorEl(event.currentTarget);
    setSelectedShare(postId);
  }

  function createHighlight() {
    let random = Math.floor(Math.random() * Math.floor(posts.length));

    return (
      <Grid
        key="highlight"
        // className={classes.gridTile}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        item
        xs={12}
        sm={12}
        md={8}
        lg={8}
        xl={8}
      >
        <AnimatePresence>
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.0, 1.0] }}
            exit={{ opacity: 0 }}
          >
            <Highlight post={posts[random]} />
          </motion.div>
        </AnimatePresence>
      </Grid>
    );
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
                        <IconButton
                          id={id}
                          aria-describedby={id}
                          onClick={(event) => handleShare(post.id, event)}
                          aria-label="share"
                        >
                          <ShareIcon />
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

                        <Tooltip
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
                        </Tooltip>
                      </div>
                    </CardActions>
                  )}
                </Card>
              </VizSensor>
            ) : (
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
                      <IconButton
                        id={id}
                        aria-describedby={id}
                        onClick={(event) => handleShare(post.id, event)}
                        aria-label="share"
                      >
                        <ShareIcon />
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
        style={{ marginBottom: "60px", marginTop: "10px" }}
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        <div>
          <Container component="main" xl={12} lg={12} md={12}>
            <CssBaseline />

            <div className={classes.paper}>
              <Grid container spacing={2}>
                {createHighlight()}
                <Grid
                  key="highlight"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  item
                  xs={0}
                  sm={0}
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
                      <img
                        src={logo}
                        alt="logo"
                        style={{
                          width: "100%",
                          padding: "10%",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </Grid>
              </Grid>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "15px",
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
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FacebookShareButton
                      url={shareUrl}
                      quote={shareTitle}
                      className="facebook-share-button"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <FacebookMessengerShareButton
                      url={shareUrl}
                      appId="521270401588372"
                      className="fb-messenger-share-button"
                    >
                      <FacebookMessengerIcon size={32} round />
                    </FacebookMessengerShareButton>

                    <TwitterShareButton
                      url={shareUrl}
                      title={shareTitle}
                      className="twitter-share-button"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <WhatsappShareButton
                      url={shareUrl}
                      title={shareTitle}
                      separator=":: "
                      className="whatsapp-share-button"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>

                    <RedditShareButton
                      url={shareUrl}
                      title={shareTitle}
                      windowWidth={660}
                      windowHeight={460}
                      className="reddit-share-button"
                    >
                      <RedditIcon size={32} round />
                    </RedditShareButton>

                    <TumblrShareButton
                      url={shareUrl}
                      title={shareTitle}
                      className="tumblr-share-button"
                    >
                      <TumblrIcon size={32} round />
                    </TumblrShareButton>
                  </div>
                </Popover>
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
