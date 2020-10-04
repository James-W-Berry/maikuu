import React, { useEffect } from "react";
import { makeStyles, GridList, GridListTile } from "@material-ui/core";
import colors from "../assets/colors";
import firebase from "../firebase";
import { useState } from "react";
import PetalIcon from "../assets/petal.png";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "BadScript",
    color: colors.maikuu4,
    userSelect: "none",
    fontSize: "30px",
    marginTop: "15px",
    marginLeft: "15px",
  },
}));

const SORT_OPTIONS = {
  LIKES_ASC: { column: "likes", direction: "asc" },
  LIKES_DESC: { column: "likes", direction: "desc" },
};

async function usePosts(sortBy) {}

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
        console.log(retrievedPosts);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [sortBy]);

  function createFeedPost(post) {
    return (
      <div key={post.id}>
        <GridListTile
          key={post.id}
          style={{
            backgroundColor: "#252a2e",
            marginBottom: "1px",
          }}
          button={true}
          onClick={() => {
            console.log(post);
          }}
        >
          <div>
            <img
              style={{ height: "30px", width: "30px" }}
              alt="post"
              src={PetalIcon}
            />{" "}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{post.title}</span>
              <span>{post.body}</span>
              <span>{post.author}</span>
              <span>{`${post.likes} likes`}</span>
            </div>
          </div>
        </GridListTile>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "85vh",
        backgroundColor: colors.maikuu2,
      }}
    >
      <GridList cellHeight={160} className={classes.gridList} cols={1}>
        {posts.map((post) => createFeedPost(post))}
      </GridList>
    </div>
  );
}
