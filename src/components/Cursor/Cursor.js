import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./Cursor.css";
import {
  Typography,
  TextField,
  makeStyles,
  Popover,
  Button,
} from "@material-ui/core";
import colors from "../../assets/colors";

export default function Cursor(props) {
  const classes = useStyles();
  const placeMarkers = props.placeMarkers;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showLineWriter, setShowLineWriter] = useState(false);
  const [title, setTitle] = useState({ value: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [markers, setMarkers] = useState({
    one: { visible: false, x: 0, y: 0 },
    two: { visible: false, x: 0, y: 0 },
    three: { visible: false, x: 0, y: 0 },
  });

  const handleClose = () => {
    setAnchorEl(null);
    setShowLineWriter(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  let doc = document.querySelector("#backgroundImageGrid");

  useEffect(() => {
    addEventListeners();
    return () => removeEventListeners();
  }, []);

  const addEventListeners = () => {
    doc = document.querySelector("#backgroundImageGrid");
    doc.addEventListener("mousemove", onMouseMove);
    doc.addEventListener("mouseenter", onMouseEnter);
    doc.addEventListener("mouseleave", onMouseLeave);
    doc.addEventListener("mousedown", onMouseDown);
    doc.addEventListener("mouseup", onMouseUp);
  };

  const removeEventListeners = () => {
    doc = document.querySelector("#backgroundImageGrid");
    doc.removeEventListener("mousemove", onMouseMove);
    doc.removeEventListener("mouseenter", onMouseEnter);
    doc.removeEventListener("mouseleave", onMouseLeave);
    doc.removeEventListener("mousedown", onMouseDown);
    doc.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseLeave = () => {
    setHidden(true);
  };

  const onMouseEnter = () => {
    setHidden(false);
  };

  const onMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseDown = (e) => {
    setClicked(true);
    setShowLineWriter(!showLineWriter);
    let _markers = markers;
    if (!_markers.one.visible) {
      _markers.one.visible = true;
      _markers.one.x = e.clientX;
      _markers.one.y = e.clientY;
    } else if (!_markers.two.visible) {
      _markers.two.visible = true;
      _markers.two.x = e.clientX;
      _markers.two.y = e.clientY;
    } else if (!_markers.three.visible) {
      _markers.three.visible = true;
      _markers.three.x = e.clientX;
      _markers.three.y = e.clientY;
    } else {
      console.log("all visible");
    }

    setMarkers(_markers);
    placeMarkers(_markers);
  };

  const onMouseUp = () => {
    setClicked(false);
  };

  const isMobile = () => {
    const ua = navigator.userAgent;
    return /Android|Mobi/i.test(ua);
  };

  const cursorClasses = classNames("cursor", {
    "cursor--clicked": clicked,
    "cursor--hidden": hidden,
  });

  if (typeof navigator !== "undefined" && isMobile()) return null;

  return (
    <div
      aria-describedby={id}
      className={cursorClasses}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: `${hidden ? 0 : 1}`,
      }}
    >
      <Popover
        id={id}
        open={showLineWriter}
        anchorEl={doc}
        onClose={handleClose}
        clickHandle={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div
          className="handle"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,1.0)",
          }}
        >
          <TextField
            className={classes.title}
            margin="normal"
            required
            name="title"
            type="text"
            id="title"
            helperText="Title"
            inputProps={{
              autoComplete: "off",
            }}
            value={title.value}
            onChange={(event) => {
              setTitle({ value: event.target.value });
            }}
          />
        </div>
      </Popover>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  title: {
    "& .MuiInputBase-input": {
      fontFamily: "BadScript",
      fontSize: "38px",
      textAlign: "center",
      color: colors.maikuu4,
    },
    "& .MuiFormHelperText-root": {
      textAlign: "center",
      color: colors.maikuu4,
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "1px solid rgba(255, 255, 255, 1)",
    },
    width: "80%",
  },
}));
