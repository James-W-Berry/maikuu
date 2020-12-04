import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./Cursor.css";

export default function Cursor(props) {
  const placeMarkers = props.placeMarkers;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [markers, setMarkers] = useState({
    one: { visible: hidden, x: 0, y: 0 },
    two: { visible: hidden, x: 0, y: 0 },
    three: { visible: hidden, x: 0, y: 0 },
  });

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

  function isNotNearMarkers(_markers, x, y) {
    let notNearMarkerOne = false;
    let notNearMarkerTwo = false;
    let notNearMarkerThree = false;

    if (
      Math.abs(x - _markers.one.x) > 50 &&
      Math.abs(y - _markers.one.y) > 50
    ) {
      notNearMarkerOne = true;
    }
    if (
      Math.abs(x - _markers.two.x) > 50 &&
      Math.abs(y - _markers.two.y) > 50
    ) {
      notNearMarkerTwo = true;
    }
    if (
      Math.abs(x - _markers.three.x) > 50 &&
      Math.abs(y - _markers.three.y) > 50
    ) {
      notNearMarkerThree = true;
    }

    return notNearMarkerOne && notNearMarkerTwo && notNearMarkerThree;
  }

  const onMouseDown = (e) => {
    setClicked(true);
    let _markers = markers;
    if (
      _markers.one.visible === "hidden" &&
      isNotNearMarkers(_markers, e.offsetX, e.offsetY)
    ) {
      _markers.one.visible = "visible";
      _markers.one.x = e.offsetX;
      _markers.one.y = e.offsetY;
    } else if (
      _markers.two.visible === "hidden" &&
      isNotNearMarkers(_markers, e.offsetX, e.offsetY)
    ) {
      _markers.two.visible = "visible";
      _markers.two.x = e.offsetX;
      _markers.two.y = e.offsetY;
    } else if (
      _markers.three.visible === "hidden" &&
      isNotNearMarkers(_markers, e.offsetX, e.offsetY)
    ) {
      _markers.three.visible = "visible";
      _markers.three.x = e.offsetX;
      _markers.three.y = e.offsetY;
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
      className={cursorClasses}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: `${hidden ? 0 : 1}`,
      }}
    />
  );
}
