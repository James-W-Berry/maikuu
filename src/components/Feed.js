import React, { useEffect } from "react";
import {
  makeStyles,
  GridList,
  GridListTile,
  Container,
  CssBaseline,
  Grid,
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
  gridList: {
    marginTop: "10px",
    // width: "100%",
    // height: "100%",
  },
  root: {
    minWidth: 275,
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const SORT_OPTIONS = {
  LIKES_ASC: { column: "likes", direction: "asc" },
  LIKES_DESC: { column: "likes", direction: "desc" },
};

export default function Main() {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState("LIKES_DESC");
  const [posts, setPosts] = useState([]);

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
      <GridListTile key={post.id} style={{ minHeight: "250px" }}>
        <Card className={classes.root}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="h5" component="h2">
              {post.line_1}
            </Typography>
            <Typography variant="h5" component="h2">
              {post.line_2}
            </Typography>
            <Typography variant="h5" component="h2">
              {post.line_3}
            </Typography>
            <Typography className={classes.title} color="textSecondary">
              {`-${post.author}`}
            </Typography>
          </CardContent>
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
            spacing={5}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item xl={12} lg={12} md={12}>
              <GridList
                spacing={4}
                style={{ margin: "10px" }}
                className={classes.gridList}
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
