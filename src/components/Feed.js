import React, { useEffect } from "react";
import {
  makeStyles,
  GridList,
  GridListTile,
  Container,
  CssBaseline,
  Grid,
  Tooltip,
} from "@material-ui/core";
import colors from "../assets/colors";
import firebase from "../firebase";
import { useState } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";

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
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
  },
  pos: {
    marginBottom: 12,
  },
  post: {
    align: "center",
    textAlign: "center",
  },
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#12121C15",
    margin: 0,
    flexShrink: 0,
  },
}));

const SORT_OPTIONS = {
  LIKES_ASC: { column: "likes", direction: "asc" },
  LIKES_DESC: { column: "likes", direction: "desc" },
};

export default function Main(props) {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState("LIKES_DESC");
  const [posts, setPosts] = useState([]);
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

  function createFeedPost(post) {
    return (
      <GridListTile key={post.id} className={classes.gridTile}>
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
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <Typography className={classes.title} color="textSecondary">
                  {post.likes}
                </Typography>
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
                <Tooltip title="Sign in to favorite posts" placement="bottom">
                  <div>
                    <IconButton aria-label="add to favorites" disabled>
                      <FavoriteIcon />
                    </IconButton>
                  </div>
                </Tooltip>

                <Typography className={classes.title} color="textSecondary">
                  {post.likes}
                </Typography>
              </div>
            </CardActions>
          )}
        </Card>
      </GridListTile>
    );
  }

  return (
    <div>
      <Container component="main" xl={12} lg={12} md={12}>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid
            container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item xl={12} lg={12} md={12}>
              <GridList
                style={{
                  margin: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                cols={1}
              >
                {posts.map((post) => createFeedPost(post))}
              </GridList>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}
