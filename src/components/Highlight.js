import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  Divider,
} from "@material-ui/core";
import React, { useState, useCallback } from "react";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px",
    "& .MuiCardContent-root:last-child": {
      padding: "0px",
    },
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px",
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
    fontSize: "3.5vw",
    align: "center",
    textAlign: "center",
    fontFamily: "BadScript",
  },
}));

export default function Highlight(props) {
  const classes = useStyles();
  const post = props.post;

  return post ? (
    <Card className={classes.root} style={{ width: "100%" }}>
      <CardContent className={classes.content}>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
          }}
          className={classes.content}
        >
          <div
            className={classes.root}
            style={{
              backgroundImage: `url(${post.image})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            <div
              className={classes.content}
              style={{
                flex: 2,
                padding: "20px",
              }}
            >
              <Typography gutterBottom className={classes.post}>
                {post.line_1}
              </Typography>

              <Typography gutterBottom className={classes.post}>
                {post.line_2}
              </Typography>

              <Typography gutterBottom className={classes.post}>
                {post.line_3}
              </Typography>
            </div>
          </div>

          <Divider orientation="vertical" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Typography
              color="textSecondary"
              gutterBottom
              className={classes.post}
            >
              {post.title}
            </Typography>

            <Typography className={classes.title} color="textSecondary">
              {`by ${post.author}`}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;
}
