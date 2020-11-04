import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import image1 from "../assets/inspiration_1.jpeg";
import image2 from "../assets/inspiration_2.jpeg";
import image3 from "../assets/inspiration_3.jpeg";
import image4 from "../assets/inspiration_4.jpeg";

export default function ImageCarousel() {
  return (
    <Carousel
      showArrows={true}
      // onChange={onChange}
      // onClickItem={onClickItem}
      // onClickThumb={onClickThumb}
    >
      <div>
        <img src={image1} style={{ maxWidth: "500px", height: "500px" }} />
        {/* <p className="legend">Legend 1</p> */}
      </div>
      <div>
        <img src={image2} style={{ maxWidth: "500px", height: "500px" }} />
        {/* <p className="legend">Legend 2</p> */}
      </div>
      <div>
        <img src={image3} style={{ maxWidth: "500px", height: "500px" }} />
        {/* <p className="legend">Legend 3</p> */}
      </div>
      <div>
        <img src={image4} style={{ maxWidth: "500px", height: "500px" }} />
        {/* <p className="legend">Legend 4</p> */}
      </div>
    </Carousel>
  );
}
