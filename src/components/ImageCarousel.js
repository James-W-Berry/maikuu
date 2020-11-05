import React, { useEffect, useState } from "react";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
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
    // <Carousel
    //   showArrows={true}
    //   // onChange={onChange}
    //   // onClickItem={onClickItem}
    //   // onClickThumb={onClickThumb}
    // >
    //   <div
    //     onSelect={() => {
    //       props.setImage(image1);
    //     }}
    //   >
    //     <img src={image1} style={{ maxWidth: "500px", height: "500px" }} />
    //     {/* <p className="legend">Legend 1</p> */}
    //   </div>
    //   <div
    //     onSelect={() => {
    //       props.setImage(image2);
    //     }}
    //   >
    //     <img src={image2} style={{ maxWidth: "500px", height: "500px" }} />
    //     {/* <p className="legend">Legend 2</p> */}
    //   </div>
    //   <div
    //     onSelect={() => {
    //       props.setImage(image3);
    //     }}
    //   >
    //     <img src={image3} style={{ maxWidth: "500px", height: "500px" }} />
    //     {/* <p className="legend">Legend 3</p> */}
    //   </div>
    //   <div
    //     onSelect={() => {
    //       props.setImage(image4);
    //     }}
    //   >
    //     <img src={image4} style={{ maxWidth: "500px", height: "500px" }} />
    //     {/* <p className="legend">Legend 4</p> */}
    //   </div>
    // </Carousel>

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
