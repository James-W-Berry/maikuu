import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../assets/colors";
import concept from "../assets/concept.gif";
import focus from "../assets/focus.gif";
import review from "../assets/review.gif";
import ours from "../assets/ours.png";
import yours from "../assets/yours.png";

export default function OnboardingCarousel(props) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      style={{
        backgroundColor: colors.maikuu0,
      }}
    >
      <Carousel.Item>
        <div
          style={{
            height: "40vh",
            minHeight: "200px",
            display: "flex",
            alignItems: "flex-start",
            marginTop: "50px",
            justifyContent: "center",
          }}
        >
          <img className="d-block w-90" src={concept} alt="concept" />
        </div>

        <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <h3>Concept</h3>
          <p>Step 1: Select a concept to reflect on</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div
          style={{
            height: "40vh",
            minHeight: "320px",
            display: "flex",
            alignItems: "flex-start",
            marginTop: "10px",
            justifyContent: "center",
          }}
        >
          <img
            className="d-block w-90"
            height={150}
            src={yours}
            alt="yours"
            style={{ backgroundColor: colors.maikuu4, marginRight: "10px" }}
          />
          <img
            className="d-block w-90"
            height={150}
            src={ours}
            alt="ours"
            style={{ backgroundColor: colors.maikuu4, marginLeft: "10px" }}
          />
        </div>

        <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <h3>Inspiration</h3>
          <p>
            Step 2: Select one of your images for inspiration or select a
            template
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={13800}>
        <div
          style={{
            minHeight: "200px",
            height: "70vh",
            display: "flex",
            alignItems: "flex-start",
            marginTop: "50px",
            justifyContent: "center",
          }}
        >
          <img className="d-block w-90" height={450} src={focus} alt="focus" />
        </div>

        <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <h3>Focus</h3>
          <p>Step 3: Focus on your inspiration for each line of the haiku</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={7900}>
        <div
          style={{
            minHeight: "200px",
            height: "70vh",
            display: "flex",
            alignItems: "flex-start",
            marginTop: "50px",
            justifyContent: "center",
          }}
        >
          <img
            className="d-block w-90"
            height={450}
            src={review}
            alt="finish"
          />
        </div>

        <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <h3>Finish</h3>
          <p>4. Review and post your haiku</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
