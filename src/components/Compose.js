import React from "react";
import HaikuBuilder from "./HaikuBuilder";
import colors from "../assets/colors";

export default function Compose() {
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
        backgroundColor: colors.maikuu5,
      }}
    >
      <HaikuBuilder />
    </div>
  );
}
