import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

import image1 from "../assets/inspiration_1.jpeg";
import image2 from "../assets/inspiration_2.jpeg";
import image3 from "../assets/inspiration_3.jpeg";
import image4 from "../assets/inspiration_4.jpeg";

export default function ImageCarousel(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          onClick={() => {
            props.updatePreviewImageFromCarousel(image1);
            props.setShowImageCarousel(false);
          }}
          className="d-block w-100 h-100"
          src={image1}
          style={{ cursor: "pointer" }}
          alt="inspiration_1"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          onClick={() => {
            props.updatePreviewImageFromCarousel(image2);
            props.setShowImageCarousel(false);
          }}
          className="d-block w-100"
          src={image2}
          style={{
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0,)",
          }}
          alt="inspiration_2"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          onClick={() => {
            props.updatePreviewImageFromCarousel(image3);
            props.setShowImageCarousel(false);
          }}
          className="d-block w-100"
          src={image3}
          style={{ cursor: "pointer" }}
          alt="inspiration_3"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          onClick={() => {
            props.updatePreviewImageFromCarousel(image4);
            props.setShowImageCarousel(false);
          }}
          className="d-block w-100"
          src={image4}
          style={{ cursor: "pointer" }}
          alt="inspiration_4"
        />
      </Carousel.Item>
    </Carousel>
  );
}
