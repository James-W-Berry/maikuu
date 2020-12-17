import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./Cursor.css";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);

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
    doc.addEventListener("mouseup", onMouseUp);
  };

  const removeEventListeners = () => {
    doc = document.querySelector("#backgroundImageGrid");
    doc.removeEventListener("mousemove", onMouseMove);
    doc.removeEventListener("mouseenter", onMouseEnter);
    doc.removeEventListener("mouseleave", onMouseLeave);
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
